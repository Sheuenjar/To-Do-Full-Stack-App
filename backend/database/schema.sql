-- =========================================
-- Create user if it doesn't exist
-- =========================================
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'todo_user'
   ) THEN
      CREATE ROLE todo_user LOGIN PASSWORD 'todo_password';
   END IF;
END
$do$;

-- =========================================
-- Create databases if they don't exist
-- =========================================
-- NOTE: CREATE DATABASE doesn't directly support IF NOT EXISTS
-- so we check beforehand
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'todo_app') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE todo_app');
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'todo_app_test') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE todo_app_test');
   END IF;
END
$do$;

-- =========================================
-- Connect to the main database
-- =========================================
\c todo_app

-- Create tasks table
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert example data
INSERT INTO tasks (title, description, completed, priority) VALUES
('Example 1', 'Example task 1', FALSE, 'high'),
('Example 2', 'Example task 2', FALSE, 'low'),
('Example 3', 'Example task 3', FALSE, 'medium');

-- Grant full privileges to the user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO todo_user;

-- =========================================
-- Connect to the test database
-- =========================================
\c todo_app_test

-- Repeat tasks table for testing
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert example data for tests
INSERT INTO tasks (title, description, completed, priority) VALUES
('Test 1', 'Test task 1', FALSE, 'high'),
('Test 2', 'Test task 2', FALSE, 'low');

-- Grant full privileges to the test user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO todo_user;

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  priority TEXT NOT NULL DEFAULT 'medium'
);

-- Example data
INSERT INTO tasks (title, description, priority) VALUES
('Example 1', 'Example task 1', 'high'),
('Example 2', 'Example task 2', 'low');
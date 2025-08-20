-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Example data
INSERT INTO tasks (title, description) VALUES
('Example 1', 'Example task 1'),
('Example 2', 'Example task 2');
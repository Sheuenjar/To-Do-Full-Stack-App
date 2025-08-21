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

INSERT INTO tasks (title, description, completed, priority) VALUES
('Example 1', 'Example task 1', FALSE, 'high'),
('Example 2', 'Example task 2', FALSE, 'low'),
('Example 3', 'Example task 3', FALSE, 'medium');

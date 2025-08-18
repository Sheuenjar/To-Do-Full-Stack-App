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
('Ejemplo 1', 'Tarea de ejemplo 1'),
('Ejemplo 2', 'Tarea de ejemplo 2');
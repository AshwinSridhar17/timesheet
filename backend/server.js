// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'timesheet',
  password: '12345678',
  port: 5432,
});

app.use(cors());
app.use(express.json()); // To parse JSON data

// Routes

// Get all projects
app.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add new project
app.post('/projects', async (req, res) => {
    // const { id } = req.params.id;
    const { project_name, client_name, project_type, project_start_date, project_expected_end_date, project_status, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (project_name, client_name, project_type, project_start_date, project_expected_end_date, project_status, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [project_name, client_name, project_type, project_start_date, project_expected_end_date, project_status, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Edit an existing project
app.put('/projects/:id', async (req, res) => {
    console.log(req.params)
  const { id } = req.params.id;
  const { project_id, project_name, client_name, project_type, project_start_date, project_expected_end_date, project_status, description } = req.body;
  console.log(req.body)

  try {
    const result = await pool.query(
      'UPDATE projects SET project_name = $1, client_name = $2, project_type = $3, project_start_date = $4, project_expected_end_date = $5, project_status = $6, description = $7 WHERE project_id = $8 RETURNING *',
      [project_name, client_name, project_type, project_start_date, project_expected_end_date, project_status, description, project_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a project
app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM projects WHERE project_id = $1', [id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

//   try {
//     await pool.query('DELETE FROM projects WHERE id = $1', [id]);
//     res.status(200).send('Project deleted');
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
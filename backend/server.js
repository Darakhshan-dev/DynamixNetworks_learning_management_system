const express = require('express');
const pool = require('./db'); // Postgres connection
const app = express();
const cors = require('cors');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// --- USER REGISTRATION ---
app.post('/api/register', async (req, res) => {
  console.log("Received registration body:", req.body);
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password || !role) {
    return res.status(400).send("Missing fields!");
  }
  try {
    await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)',
      [full_name, email, password, role]
    );
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// --- COURSES CRUD ---
app.get('/api/courses', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM courses ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.post('/api/courses', async (req, res) => {
  const { title, instructor, category, duration, students, thumbnail, lessons, description } = req.body;
  if (!title || !instructor || !category) {
    return res.status(400).send("Missing required course fields!");
  }
  try {
    await pool.query(
      'INSERT INTO courses (title, instructor, category, duration, thumbnail, lessons, description) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [title, instructor, category, duration, thumbnail, lessons, description]
    );
    res.status(201).send("Course added");
  } catch (error) {
    console.error('Error adding course:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, instructor, category, duration, students, thumbnail, lessons, description } = req.body;
  try {
    await pool.query(
      'UPDATE courses SET title=$1, instructor=$2, category=$3, duration=$4, students=$5, thumbnail=$6, lessons=$7, description=$8 WHERE id=$9',
      [title, instructor, category, duration, students, thumbnail, lessons, description, id]
    );
    res.send("Course updated");
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM courses WHERE id=$1', [id]);
    res.send("Course deleted");
  } catch (error) {
    console.error('Error deleting course:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// --- SECTIONS CRUD ---
// List all sections for course
app.get('/api/courses/:courseId/sections', async (req, res) => {
  const { courseId } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM sections WHERE course_id=$1 ORDER BY id', [courseId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sections:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Add section to course
app.post('/api/sections', async (req, res) => {
  const { course_id, title } = req.body;
  if (!course_id || !title) {
    return res.status(400).send("Course ID and Title required!");
  }
  try {
    await pool.query(
      'INSERT INTO sections (course_id, title) VALUES ($1, $2)',
      [course_id, title]
    );
    res.status(201).send("Section added");
  } catch (error) {
    console.error('Error adding section:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// --- LESSONS CRUD ---
// List all lessons for section
app.get('/api/sections/:sectionId/lessons', async (req, res) => {
  const { sectionId } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM lessons WHERE section_id=$1 ORDER BY id', [sectionId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching lessons:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Add lesson to section
app.post('/api/lessons', async (req, res) => {
  const { section_id, title, video_url, duration } = req.body;
  if (!section_id || !title || !video_url) {
    return res.status(400).send("Section ID, title, and video URL required!");
  }
  try {
    await pool.query(
      'INSERT INTO lessons (section_id, title, video_url, duration) VALUES ($1, $2, $3, $4)',
      [section_id, title, video_url, duration]
    );
    res.status(201).send("Lesson added");
  } catch (error) {
    console.error('Error adding lesson:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

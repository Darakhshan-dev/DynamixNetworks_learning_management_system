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
  const { title, instructor, category, duration, thumbnail, lessons, description, progress } = req.body;
  if (!title || !instructor || !category) {
    return res.status(400).send("Missing required course fields!");
  }
  try {
    await pool.query(
      'INSERT INTO courses (title, instructor, category, duration, thumbnail, lessons, description, progress) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [title, instructor, category, duration, thumbnail, lessons, description, progress ?? 0] // Default to 0 if not sent
    );
    res.status(201).send("Course added");
  } catch (error) {
    console.error('Error adding course:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, instructor, category, duration, thumbnail, lessons, description, progress } = req.body;
  try {
    await pool.query(
      'UPDATE courses SET title=$1, instructor=$2, category=$3, duration=$4, thumbnail=$5, lessons=$6, description=$7, progress=$8 WHERE id=$9',
      [title, instructor, category, duration, thumbnail, lessons, description, progress ?? 0, id]
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

// Get a single course by ID
app.get('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM courses WHERE id=$1', [id]);
    if (rows.length === 0) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// Get all sections/modules for a single course ID (for use in course detail page)
app.get('/api/courses/:id/sections', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM sections WHERE course_id=$1 ORDER BY id', [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});


// --- SECTIONS CRUD ---
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

// --- USER PROFILE ---
// This version returns the *first* user in your Users table. Edit as needed for auth/active user!
app.get('/api/profile', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users LIMIT 1');
    if (rows.length === 0) {
      // Fallback default user
      return res.json({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        bio: "Passionate learner focused on web development.",
        courses: 8, // Fill these from your DB if you have them as columns
        hours: 124,
        complete: 5,
        achievements: [
          { title: "Fast Learner", description: "Completed 5 courses", icon: "TrendingUp" },
          { title: "Dedicated Student", description: "100 hours of learning", icon: "Clock" },
          { title: "Course Champion", description: "Finished first course", icon: "Award" }
        ]
      });
    }
    const user = rows[0];
    // Adjust keys for your users table schema!
    res.json({
      firstName: user.full_name?.split(" ")[0] || "",
      lastName: user.full_name?.split(" ")[1] || "",
      email: user.email || "",
      bio: user.bio || "Passionate learner focused on web development.",
      courses: user.courses || 8,
      hours: user.hours || 124,
      complete: user.complete || 5,
      achievements: [
        { title: "Fast Learner", description: "Completed 5 courses", icon: "TrendingUp" },
        { title: "Dedicated Student", description: "100 hours of learning", icon: "Clock" }
      ]
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

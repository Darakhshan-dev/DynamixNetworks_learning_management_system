const express = require("express");
const pool = require("./db"); // Postgres connection
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/api/upload-video", (req, res, next) => {
  console.log("UPLOAD ROUTE HIT");
   console.log("Uploaded file info:", req.file); 
  next();
},
upload.single("video"),
(req, res) => {
  if (!req.file) {
    console.error("No file uploaded!");
    return res.status(400).send("No file uploaded");
  }
  const videoPath = "/uploads/" + req.file.filename;
  res.json({ success: true, video_url: videoPath });
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// --- Video upload route ---
app.post("/api/upload-video", upload.single("video"), async (req, res) => {
  try {
    const title = req.body.title || "untitled";
    const videoPath = "/uploads/" + req.file.filename;

    // Save videoPath in your lessons table
    await pool.query(
      "INSERT INTO lessons (title, video_url) VALUES ($1, $2)",
      [title, videoPath]
    );
    res.json({ success: true, video_url: videoPath });
  } catch (err) {
    console.error("Error uploading video:", err);
    res.status(500).send("Failed to upload video");
  }
});

// --- USER REGISTRATION (unique email + role) ---
app.post("/api/register", async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password || !role) {
    return res.status(400).send("Missing fields!");
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2",
      [email, role]
    );
    if (rows.length > 0) {
      return res.status(400).send("Email already registered for this role");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)",
      [full_name, email, hashedPassword, role]
    );
    res.status(201).send("User registered");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).send("Server error: " + error.message);
  }
});

// --- USER LOGIN (email + role) ---
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).send("Email, password and role are required");
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role=$2",
      [email, role]
    );
    if (rows.length === 0) return res.status(401).send("Invalid credentials");

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { email: user.email, fullName: user.full_name, role: user.role },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// --- JWT VERIFY MIDDLEWARE ---
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Missing token");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Missing token");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

// --- USER PROFILE (secured) ---
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    if (rows.length === 0) return res.status(404).send("User not found");
    const user = rows[0];
    res.json({
      firstName: user.full_name?.split(" ")[0] || "",
      lastName: user.full_name?.split(" ")[1] || "",
      email: user.email,
      bio: user.bio || "",
      role: user.role || "",
      courses: user.courses || 0,
      hours: user.hours || 0,
      complete: user.complete || 0,
      achievements: [],
    });
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
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
      [title, instructor, category, duration, thumbnail, lessons, description, progress ?? 0]
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

app.get('/api/courses/:id/sections', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM sections WHERE course_id=$1 ORDER BY id', [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

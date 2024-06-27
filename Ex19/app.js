const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('./config/passport-config');
const multer = require('multer');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.use(passport.initialize());

const authorize = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ msg: 'Unauthorized' });
    req.user = user;
    next();
  })(req, res, next);
};

const upload = multer({ dest: 'uploads/' });

app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.status(201).json({ msg: 'Signup successful. Now you can log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);

    res.json({ token, id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users/logout', authorize, async (req, res) => {
  try {
    await pool.query('UPDATE users SET token=NULL WHERE id=$1', [req.user.id]);
    res.json({ msg: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/protected-route', authorize, (req, res) => {
  res.json({ msg: 'You have accessed a protected route', user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

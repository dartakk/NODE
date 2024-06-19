const { Pool } = require('pg');
const Joi = require('joi');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const validatePlanet = (planet) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1),
    name: Joi.string().min(1).required()
  });
  return schema.validate(planet);
};

exports.getAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM planets');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server Error');
  }
};

exports.getOneById = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM planets WHERE id = $1', [req.params.id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).send('Planet not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server Error');
  }
};

exports.create = async (req, res) => {
  try {
    const { error } = validatePlanet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const client = await pool.connect();
    const result = await client.query('INSERT INTO planets (name) VALUES ($1) RETURNING *', [req.body.name]);
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server Error');
  }
};

exports.updateById = async (req, res) => {
  try {
    const { error } = validatePlanet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const client = await pool.connect();
    const result = await client.query('UPDATE planets SET name = $1 WHERE id = $2 RETURNING *', [req.body.name, req.params.id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).send('Planet not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server Error');
  }
};

exports.deleteById = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM planets WHERE id = $1 RETURNING *', [req.params.id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).send('Planet not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server Error');
  }
};

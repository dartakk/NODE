const express = require('express');
const Joi = require('joi');
const planets = require('./planets');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT

const validatePlanet = (planet) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).required()
  });
  return schema.validate(planet);
};

app.get('/api/planets', (req, res) => {
  res.status(200).json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).send('Planet not found');
  res.status(200).json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error } = validatePlanet(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newPlanet = {
    id: planets.length ? planets[planets.length - 1].id + 1 : 1,
    name: req.body.name
  };
  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).send('Planet not found');

  const { error } = validatePlanet(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  planet.name = req.body.name;
  res.status(200).json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const planetIndex = planets.findIndex(p => p.id === parseInt(req.params.id));
  if (planetIndex === -1) return res.status(404).send('Planet not found');

  planets.splice(planetIndex, 1);
  res.status(200).json({ msg: 'Planet deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

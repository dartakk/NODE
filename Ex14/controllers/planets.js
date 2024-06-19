const Joi = require('joi');
let planets = require('../planets');

const validatePlanet = (planet) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1),
    name: Joi.string().min(1).required()
  });
  return schema.validate(planet);
};

exports.getAll = (req, res) => {
  try {
    res.status(200).json(planets);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getOneById = (req, res) => {
  try {
    const planet = planets.find(p => p.id === parseInt(req.params.id));
    if (!planet) return res.status(404).send('Planet not found');
    res.status(200).json(planet);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.create = (req, res) => {
  try {
    const { error } = validatePlanet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newPlanet = {
      id: planets.length + 1,
      name: req.body.name
    };

    planets.push(newPlanet);
    res.status(201).json(newPlanet);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.updateById = (req, res) => {
  try {
    const { error } = validatePlanet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const planet = planets.find(p => p.id === parseInt(req.params.id));
    if (!planet) return res.status(404).send('Planet not found');

    planet.name = req.body.name;

    res.status(200).json(planet);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.deleteById = (req, res) => {
  try {
    const planet = planets.find(p => p.id === parseInt(req.params.id));
    if (!planet) return res.status(404).send('Planet not found');
    planets = planets.filter(p => p.id !== parseInt(req.params.id));

    res.status(200).json(planet);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

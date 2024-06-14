const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

let planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Benvenuti nella pagina dei pianeti');
});

app.get('/planets', (req, res) => {
  res.json(planets);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Errore!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

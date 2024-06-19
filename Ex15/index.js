const express = require('express');
const bodyParser = require('body-parser');
const planetsController = require('./controllers/planets');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT

app.get('/api/planets', planetsController.getAll);
app.get('/api/planets/:id', planetsController.getOneById);
app.post('/api/planets', planetsController.create);
app.put('/api/planets/:id', planetsController.updateById);
app.delete('/api/planets/:id', planetsController.deleteById);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const { options } = require('./config');

const app = express();

app.use(express.static(`${process.cwd()}/public`));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

app.get('/fetch/data', async (req, res) => {
  const response = await fetch(process.env.URL, options);
  const data = await response.json();
  res.json(data);
});
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`server listening on port ${PORT}`);
  /* eslint-enable no-console */
});

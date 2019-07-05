#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const { middleware } = require('libubsub');

const app = express();

const PORT = 18080;

// Simple logger
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use(middleware.validateSignature('example.com'));
app.use(bodyParser.json());

// Uncomment to fake-hijack a request body (to fail the signature)
/* app.use((req, res, next) => {
  req.body = 'hijacked!';
  next();
}); */

app.use(middleware.validateBodyHash());


app.get('/test', (req, res) => {
  console.dir(req.body);
  res.send('OK');
});

app.listen(18080, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

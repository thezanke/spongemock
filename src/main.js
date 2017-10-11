const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const controller = require('./controller');
const notFound = require('./not-found');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(controller);
app.use(notFound);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 3000!!');
});

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const controller = require('./controller');
const notFound = require('./not-found');

const app = express();

app.use(helmet());
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(controller);
app.use(notFound);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}!!`);
});

const fs = require('fs');

module.exports = (req, res) => {
  const img = fs.readFileSync(`${__dirname}/img/404bob.jpg`);
  res.writeHead(200, { 'Content-Type': 'image/gif' });
  res.end(img, 'binary');
};

const { Router } = require('express');

const generateMeme = require('./generate-meme');

const router = Router();

router.post('/', (req, res) => {
  generateMeme(req.body);
  res.json({ message: 'hello' });
});

module.exports = router;

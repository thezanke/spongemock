const { Router } = require('express');

const generateMeme = require('./generate-meme');

const router = Router();

router.post('/', (req, res) => {
  const { text } = req.body;
  generateMeme(text);
  res.json({ text: 'one moment please...' });
});

module.exports = router;

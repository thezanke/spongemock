const router = require('express').Router();

router.post('/', (req, res) => {
  res.json({ message: 'hello' });
});

module.exports = router;

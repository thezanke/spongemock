const path = require('path');
const { Router } = require('express');
const fetch = require('node-fetch');

const generate = require('./generate');

const router = Router();

router.post('/', (req, res) => {
  const { text, response_url: responseUrl } = req.body;

  res.status(200).json({ text: 'one moment please, polishing meme...' });

  generate(text, async (err, img) => {
    if (err) {
      console.error(err);
      return;
    }

    const imageUrl = `http://spongemock.alexhoward.io/images/${path.basename(img)}`;

    if (!responseUrl) {
      console.log('generated', imageUrl);
      return;
    }

    try {
      const res = await fetch(responseUrl, {
        method: 'POST',
        body: JSON.stringify({
          response_type: 'in_channel',
          attachments: [{ image_url: imageUrl }],
        }),
      });

      if (!res.ok) {
        console.error('something went wrong?');
      }
    } catch (e) {
      console.error(e);
    }
  });
});

module.exports = router;

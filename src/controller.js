const path = require('path');
const { Router } = require('express');
const fetch = require('node-fetch');

const generate = require('./generate');

const router = Router();

router.post('/', (req, res) => {
  const { text, response_url: responseUrl } = req.body;

  res.status(200).json({ text: 'one moment please, polishing meme...' });

  generate(text, async (err, img, mockText) => {
    if (err) {
      console.error(err);
      return;
    }

    const imageUrl = `http://spongemock.alexhoward.io/images/${path.basename(img)}`;

    if (!responseUrl) {
      console.log('generated', imageUrl);
      return;
    }

    const body = {
      response_type: 'in_channel',
      attachments: [{ fallback: mockText, pretext: mockText, image_url: imageUrl }],
    };
    console.log(`Responding to slack at ${responseUrl} with body:`);
    console.log(JSON.stringify(body, null, 2));

    try {
      const post = await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!post.ok) {
        console.error('something went wrong?');
      }

      const textRes = await post.text();
      console.log(textRes);
    } catch (e) {
      console.error(e);
    }
  });
});

module.exports = router;

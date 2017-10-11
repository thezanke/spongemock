const caption = require('caption');
const randomstring = require('randomstring');

const alternateCase = str =>
  str
    .toLowerCase()
    .split('')
    .map((char, i) => (i % 2 === 0 ? char : char.toUpperCase()))
    .join('');

module.exports = (text) => {
  console.log(`generating meme for: "${text}"`);

  const words = alternateCase(text).split(' ');
  const half = Math.floor(words.length / 2);
  const topCaption = words.slice(0, half).join(' ');
  const bottomCaption = words.slice(half).join(' ');

  const outputFile = `./images/mockbob-${randomstring.generate(5)}.jpg`;

  caption.path(
    './src/mockbob.jpg',
    {
      caption: topCaption,
      bottomCaption,
      outputFile,
    },
    (err, captionedImg) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(captionedImg);
    },
  );
};

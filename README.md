# Deepavali

A festival-of-lights website. Light a diya, set off fireworks, count down to the night, play a little, and send a greeting card.

Designed and built by Jerry.

## What is on the page

- **Hero and diyas:** a glowing lamp, and five lamps to light. Light all five for fireworks.
- **Fireworks:** embers, rockets, a cursor sparkler, scroll bursts, corner fountains, a "Bomb cracker" and a 30 second "Surprise me" show that opens by spelling "Happy Deepavali". Sounds are made in the browser with the Web Audio API, no audio files.
- **Countdown:** counts to 6 pm on 8 November 2026.
- **The five days, stories and the sweet table:** short facts about the festival.
- **Make your diya:** choose clay, flame and a wish, then keep a row of your lamps (saved on the device only).
- **Paint a rangoli:** choose a colour for every ring and download the result as a picture.
- **Play:** a five-question quiz and a memory-match game.
- **Cards:** a greeting card in English, Tamil, Hindi or Telugu in three looks, and an open house invitation. Download as a picture or share to WhatsApp.
- **Lights off:** the page goes dark with a lamp that follows the cursor.
- **Extras:** a short first-visit tour, and the site installs as an app.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page |
| `style.css`, `tokens.css`, `base.css` | Styles. Every colour and font is a token in `tokens.css` and the top of `style.css` |
| `main.js` | Diya lighting, fireworks, sound and the kolam |
| `extras.js` | Countdown, sweets, designers, games, cards, lights off, tour, install |
| `flag.js` | Marks the page as script-enabled |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline support and install |
| `vercel.json` | Security headers, including a strict content security policy |

There is no build step and no dependencies. It is plain HTML, CSS and JavaScript.

## Run it locally

The service worker and sharing features need a real address, so serve the folder instead of opening the file directly:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

It is a static site. Deploy the folder as-is to any static host. `vercel.json` carries the security headers for Vercel.

## Security

- No cross-site requests; the only outside resource is Google Fonts.
- Typed names and wishes are always inserted as plain text, never as HTML.
- Strict content security policy, no framing, no sniffing, no referrer, camera, microphone and location blocked.
- Saved diyas are validated when read back from browser storage.

## Notes

- The festival date shifts each year with the lunar calendar. To change the countdown, edit the date in `extras.js`.
- Fireworks and motion are skipped for visitors who have reduced motion turned on.
- The Tamil, Hindi and Telugu greetings should be checked by a reader of each language before sharing widely.

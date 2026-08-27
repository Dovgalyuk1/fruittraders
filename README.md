# $FRUITS — Fruit Traders

Meme-coin landing page. Pure static HTML/CSS/JS, no build step.

## Deploy
Drag-and-drop this whole folder into a new GitHub repo, then import that repo
into Vercel (preset "Other", no build command). Static site, works as-is.

## Before going live
Open `script.js` and fill in `CONFIG`:
- `CA` — the token contract address (leave empty to keep "COMING SOON" placeholder)
- `CHART_URL` — Dexscreener/pump.fun pair link
- `BUY_URL` — swap link (Jupiter/pump.fun)
- `X_URL`, `TELEGRAM_URL` — social links

Once `CA` is set, the Silo Report section and copy buttons switch on automatically.

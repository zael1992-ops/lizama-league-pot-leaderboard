# Lizama League Pot Leaderboard

A tiny static site — no build step, no backend. It's just `index.html` +
`style.css` + `script.js`, and all the standings/payment data lives in
`data.json`. Update the standings by editing that one file and pushing.

## 1. Open in VS Code

1. Unzip the project folder.
2. In VS Code: **File → Open Folder…** and select `lizama-league`.
3. (Optional) Install the "Live Server" extension, right-click
   `index.html`, and choose **Open with Live Server** to preview locally
   before pushing.

## 2. Push to GitHub

From a terminal inside the project folder:

```bash
git init
git add .
git commit -m "Initial leaderboard"
gh repo create lizama-league --public --source=. --push
```

(No GitHub CLI? Create an empty repo on github.com named `lizama-league`,
then:)

```bash
git remote add origin https://github.com/<your-username>/lizama-league.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is
   easiest).
2. **Add New… → Project**, import the `lizama-league` repo.
3. Framework preset: **Other** (it's a static site — no build command,
   no output directory needed).
4. Click **Deploy**. You'll get a URL like
   `https://lizama-league.vercel.app` that works on phones and computers.

## Updating standings each week

Edit `data.json`:

```json
{ "name": "Potatoe", "color": "#f97316", "initial": "P", "w": 3, "l": 1, "t": 0, "pts": 42, "status": "paid" }
```

- `status` is one of `"paid"`, `"pledged"`, or `"pastdue"`.
- The table re-sorts by `pts` automatically — you don't need to reorder
  the list yourself.

Commit and push:

```bash
git add data.json
git commit -m "Update week 4 standings"
git push
```

Vercel redeploys automatically on every push to `main` — the live page
updates within a few seconds, no dashboard steps needed.

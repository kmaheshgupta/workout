# 💪 Workout Assistant

A personal, mobile-friendly workout companion for **Mahesh**. It shows your weekly
plan, tracks what you've completed, and — most importantly — gives **step-by-step
form guidance** for every exercise so you train with the right posture.

Built as a plain static site (HTML + CSS + JS). **No build tools, no server, no
frameworks.** Open it by double-clicking `index.html`.

---

## 📂 What's in here

| File | What it is | Do you edit it? |
| --- | --- | --- |
| `data.js` | **Your plan + all exercise instructions.** | ✅ **Yes — this is the only file you normally touch.** |
| `index.html` | Page structure. | Rarely |
| `styles.css` | Look, theme, layout. | Only for visual tweaks |
| `app.js` | App logic (rendering, progress, streaks). | No |
| `manifest.json` | Lets you "Add to Home Screen" on your phone. | No |
| `assets/icon.svg` | App icon. | No |
| `assets/originals/` | The original full-day poster images (untouched), kept for future reference. | No |
| `assets/exercises/` | Per-exercise images auto-sliced from the originals. | No |
| `scripts/slice-exercises.ps1` | Re-slices `assets/originals/*.png` into `assets/exercises/*.jpg`. | Only if you replace a poster |

---

## ▶️ How to run it locally (on your laptop)

Just **double-click `index.html`** — it opens in your browser and works fully
offline. Progress you check off is saved in that browser.

> **Optional (nicer) way:** In VS Code, install the *Live Server* extension,
> right-click `index.html` → **Open with Live Server**. This auto-refreshes when
> you edit files. Not required, just convenient.

### Test the mobile look on your laptop
1. Open the page in Chrome/Edge.
2. Press `F12` (DevTools) → click the **phone/tablet icon** (top-left of DevTools,
   or `Ctrl+Shift+M`).
3. Pick a device like *iPhone 14*. That's exactly how it looks on your phone.

---

## ✏️ How to change your exercises (the main thing you'll do)

Everything lives in **`data.js`**. Open it in any text editor. The top of the file
has full instructions, but here's the short version.

### Change an existing exercise
Find the day (`mon`, `tue`, …), find the exercise, edit the value. Example:

```js
{
  id: "db-bench-press",
  name: "Dumbbell Bench Press",
  sets: "3 × 10",          // ← change reps/sets here
  difficulty: "Medium",     // "Easy" | "Medium" | "Hard"
  ...
}
```

> ⚠️ Keep the quotes `"..."` and the commas exactly as shown. That's all that matters.

### Add a new exercise
Copy one full `{ ... }` block inside a day's `exercises: [ ]` list, paste it right
after, and edit it. Minimum needed for a good card:

```js
{
  id: "my-new-exercise",          // must be unique, no spaces
  name: "My New Exercise",
  sets: "3 × 12",
  difficulty: "Easy",
  muscles: ["Chest"],
  tutorial: "https://www.youtube.com/results?search_query=my+exercise+form",
  form: {
    steps: [
      "First do this...",
      "Then do that..."
    ],
    cues: ["Keep your back flat"],
    mistakes: ["Don't round your back"],
    breathing: "Exhale on the effort.",
    safety: "Stop if it hurts."
  }
}
```

### Remove an exercise
Delete its whole `{ ... }` block (and the trailing comma). Done.

### Add an image or GIF to an exercise
Add an `image` line. It accepts **either**:

```js
image: "https://example.com/pushup.gif",   // an online link
// OR
image: "assets/pushup.jpg",                // a file you drop in the assets folder
```

No `image`? The app shows a clean illustrated placeholder — totally fine.

### Updating the original poster images
The full-day posters you provided live untouched in `assets/originals/` (e.g.
`monday.png`). If you get a new/updated poster for a day, replace that file
(keep the same lowercase name) and re-run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/slice-exercises.ps1
```

This regenerates the matching files in `assets/exercises/` used by `data.js`.
The crop coordinates for each exercise panel live at the top of that script.

---

## 🚀 Deploying to GitHub Pages
This is a static site, so no build step is needed. The repo is set up to
publish automatically via **GitHub Actions** on every push to `main`
(`.github/workflows/deploy-pages.yml`).

One-time setup (not yet done):
1. Push this repo to `https://github.com/kmaheshgupta/workout`.
2. In the repo, go to **Settings → Pages → Source** and select **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the site publishes to
   `https://kmaheshgupta.github.io/workout/`.

All asset paths in this project are relative, so it works correctly under the
`/workout/` subpath without any changes.

---

## 🗓️ Add weekend workouts (later)

Weekends currently show a **Rest & Recovery** card. To turn Saturday into a
workout, find `sat` near the bottom of `data.js` and change it from this:

```js
sat: {
  type: "rest",
  title: "Rest & Recovery",
  ...
}
```

to this shape (copy a weekday like `mon` as your template):

```js
sat: {
  type: "workout",
  focus: "Mobility • Cardio",
  muscles: ["Full body"],
  note: "Easy weekend session.",
  vibe: { label: "Weekend flow", link: "https://..." },
  exercises: [
    { id: "sat-ex-1", name: "...", sets: "...", form: { steps: ["..."] } }
  ]
}
```

Nothing else needs changing — the app picks it up automatically. Same for `sun`.

---

## 🥗 Nutrition / diet plan (future)

There's already a **Nutrition** tab (shows "Coming soon"). When you're ready to add
your diet plan, the `nutrition` block at the bottom of `data.js` is reserved for it —
so it can be added later without rebuilding the app.

---

## 🎨 Personalisation

In `data.js` under `profile` you can change:
- `name` — used in greetings.
- `defaultTheme` — `"dark"` or `"light"` (there's also a 🌙/☀️ toggle in the app).
- `quotes` — the rotating motivational line on the home screen (one per day).

---

## 📈 How progress & streaks work

- Checking off exercises is saved in your browser's local storage, per date.
- **Week complete %** = scheduled workout days you've fully finished this week.
- **Streak** = consecutive scheduled workout days completed up to today.
- Because it's stored in the browser, progress is **per-device** (your laptop and
  your phone track separately). No account or internet needed.

---

## 🚀 Deploy it to the web (GitHub Pages)

So you can open it from your phone anywhere:

1. Create a GitHub repo (working name: **`workout`**).
2. Put these files in it and push:
   ```bash
   git init
   git add .
   git commit -m "Workout assistant"
   git branch -M main
   git remote add origin https://github.com/<your-username>/workout.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main` / root → Save.**
4. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/workout/`.
5. Open that link on your phone → browser menu → **Add to Home Screen** for an
   app-like icon.

> Whenever you edit `data.js` later, just commit & push again — Pages updates
> automatically.

---

## 🔒 Notes

- 100% static and offline-capable. No data leaves your device.
- Exercise form guidance is general strength-training coaching. It is **not**
  medical advice — the built-in safety reminders (neck neutral, brace core, stop on
  pain) are there for a reason. If something hurts, stop.

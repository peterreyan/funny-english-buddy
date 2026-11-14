# Quacky English Buddy

A beginner-friendly, browser-based English practice voice bot for children. It features an original cartoon duck persona, speech input, spoken replies, vocabulary, spelling, a mini quiz, and conversation prompts.

## 1. Requirements

- Windows 10 or 11
- Node.js 18 or newer
- Google Chrome recommended
- A free GitHub account and free Vercel account for online deployment

No API keys, paid subscriptions, database, or `npm install` are required.

## 2. Run locally on Windows

1. Extract the ZIP file.
2. Open the extracted `quacky-english-buddy` folder.
3. Click the File Explorer address bar, type `cmd`, and press Enter.
4. Run:

   ```bash
   node server.js
   ```

5. Open Chrome and visit `http://localhost:3000`.
6. Press **Tap to talk** and allow microphone access.

To stop the local server, return to Command Prompt and press `Ctrl + C`.

## 3. Upload the project to GitHub (browser method)

1. Sign in at [https://github.com](https://github.com).
2. Click the **+** icon (top-right) and choose **New repository**.
3. Enter a repository name, for example `quacky-english-buddy`.
4. Choose **Public** or **Private**.
5. Do not add a README, `.gitignore`, or licence on GitHub because these are already included in this project.
6. Click **Create repository**.
7. On the new empty repository page, choose **uploading an existing file**.
8. Open the extracted project folder on your computer. Select all the files and folders inside it (`public`, `server.js`, `package.json`, `vercel.json`, `.gitignore`, and `README.md`) and drag them into the GitHub upload area.
9. Wait for the files to finish uploading.
10. Enter a commit message such as `Initial Quacky English Buddy app` and click **Commit changes**.

Important: upload the contents of the project folder, not the ZIP file itself. The `public` folder should appear at the top level of your GitHub repository.

## 4. Deploy from GitHub to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up or sign in. You can use your GitHub account.
2. In the Vercel dashboard, click **Add New…** → **Project**.
3. Find your `quacky-english-buddy` GitHub repository and click **Import**.
4. In Configure Project:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** leave empty / override disabled
   - **Output Directory:** `public`
   - **Install Command:** leave empty / override disabled
5. Click **Deploy**.
6. When deployment finishes, open the Vercel URL shown on screen, for example `https://quacky-english-buddy.vercel.app`.

The included `vercel.json` sets the static output directory to `public`. No environment variables are needed. Every new commit pushed to the connected GitHub repository will trigger a new Vercel deployment automatically.

## 5. Features

- Click-to-talk: tap the microphone to start or stop listening
- Hold-to-talk: hold the microphone briefly while speaking; release to stop
- English (UK) speech recognition setting
- Spoken replies using browser speech synthesis
- Word of the day, spelling practice, quick quiz, and conversation prompts
- Text input if speech recognition is unavailable
- Mute button and practice-star counter
- Responsive layout for desktop and mobile

## 6. Voice and browser limitations

This project uses browser-provided Web Speech APIs.

- **Speech recognition:** `SpeechRecognition` / `webkitSpeechRecognition`. Support varies by browser. Chrome is recommended. Recognition may require an internet connection and may be processed by the browser provider; this app does not send audio to its own server.
- **Speech output:** `speechSynthesis`. The app selects an available English voice when possible and uses a slightly higher pitch and lively pace. The exact voice depends on voices installed on the device and browser. It is not a custom character voice and cannot be guaranteed to sound the same on every computer.
- **Deployed site microphone:** Vercel serves the site over HTTPS, which is suitable for browser microphone permission. Allow microphone access when prompted.
- If the microphone does not work, check Chrome's site microphone permission and Windows microphone privacy settings. You can always type instead.

## 7. How the practice bot works

The conversation engine is a small set of local rules and learning activities, not a generative AI model. It can respond to common greetings, introductions, practice requests, and the included game flows. It does not understand every possible sentence or provide a full grammar tutor. No external AI API is used, so there are no API charges or API keys.

## 8. Child-friendly use and privacy

- The app does not include accounts, advertising, analytics, chat storage, or a backend database.
- Messages are kept only in the open browser page and disappear when it is closed or refreshed.
- Browser speech recognition may be handled by the browser provider. An adult should review the browser's speech-recognition and privacy settings before a child uses voice mode.
- Use with adult supervision. Do not enter personal information.

## 9. Project structure

```text
quacky-english-buddy/
├── .gitignore
├── package.json
├── server.js
├── vercel.json
├── README.md
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
```

## 10. Character note

Quacky is an original, unofficial fan-made learning character with a lively classic-cartoon feel. The project is not official and is not affiliated with Disney or any other studio. All dialogue in the app is original.

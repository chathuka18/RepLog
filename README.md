# RepLog — Firebase Gym Tracker

A responsive React + Vite gym tracker with Firebase Authentication and Cloud Firestore syncing. This version contains the **final four-day Upper/Lower plan** from our conversation (wide-grip cable upright row, cable face pull, floor reverse crunch, dead bug and plank included).

## Features

- Sign up, sign in, password reset and sign out with Firebase Email/Password Authentication.
- Realtime sync across devices on the **same Firebase user account**.
- Dashboard, workout calendar, rest days, full routine and dated completion checklists.
- Exercise weight history (including initial reference values); body-weight logging.
- Exercise-specific filmed videos where available, external guides for some exercises, front/back primary and secondary muscle diagram, form and mistake notes.
- Mobile responsive layout with bottom navigation.
- JSON export/import, including import of previous RepLog backups.

## 1. Create a Firebase project

1. Visit https://console.firebase.google.com/ and create a project named, for example, `replog-gym`.
2. Open **Project settings → General → Your apps → Add app → Web**. Register the web app. You do not need Firebase Hosting when using Vercel.
3. Copy the web app configuration fields (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
4. Open **Authentication → Sign-in method**, enable **Email/Password** and save.
5. Open **Firestore Database → Create database**, choose a region near your users, and create it. Do **not** use permissive test-mode rules in production.
6. Open **Firestore Database → Rules**. Replace the default rules with the contents of `firestore.rules`, then **Publish**.
7. In **Authentication → Settings → Authorized domains**, ensure your actual Vercel domain is allowed, especially when using a custom domain. `localhost` may need to be added for local testing depending on project settings.

## 2. Configure the app locally

Use Node.js 20.19+ or 22.12+.

```bash
cp .env.example .env.local
```

Edit `.env.local` with the corresponding values from the Firebase web app config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then:

```bash
npm install
npm run dev
```

Open the URL displayed by Vite, create an account, and start tracking. Before deployment, check the production build with `npm run build`.

**Important:** Firebase web config values are intended for client apps and are not a substitute for security rules. Do not put private service-account JSON files or admin SDK secrets in frontend code or Vercel `VITE_*` variables.

## 3. GitHub → Vercel deployment

If this project is replacing your current repository (`chathuka18/RepLog`), **back up your current working copy and data first**. Extract this ZIP and use the extracted folder as the Git repository root (the folder containing `package.json`).

```bash
git init
git add .
git commit -m "Add Firebase sync and updated workout plan"
git branch -M main
git remote add origin https://github.com/chathuka18/RepLog.git
git push -u origin main
```

If the destination already has a commit history, **do not blindly run `git push --force`**. Instead copy updated project files into your existing cloned repository, commit, and push normally.

1. Go to https://vercel.com/new and import the GitHub repo.
2. **Framework:** Vite. **Build command:** `npm run build`. **Output directory:** `dist`. **Root directory:** the folder containing `package.json`.
3. In **Project Settings → Environment Variables**, add the same six `VITE_FIREBASE_*` keys from `.env.local`. Add them for Production (and Preview as needed).
4. Redeploy after setting the variables.
5. Return to Firebase Authentication's **Authorized domains** list and allow the new Vercel domain if required.

## 4. Where your records are stored

Your records are saved in **Cloud Firestore**, each below your authenticated user ID:

```
users/{firebaseAuthUid}/tracker/replog_workouts_v1
users/{firebaseAuthUid}/tracker/replog_weights_v1
users/{firebaseAuthUid}/tracker/replog_body_v1
users/{firebaseAuthUid}/tracker/replog_completed_v1
```

Each document stores the corresponding data as JSON text. This is a lightweight personal-use architecture; it is not meant for massive datasets or simultaneous multi-user collaboration. `firestore.rules` restricts each account to its own documents. Firebase quotas, connection and internet access apply; the interface shows errors if syncing fails.

### Migrating your original localStorage data

The Firebase app does **not** silently copy local data. To keep earlier sessions:

1. Open the old RepLog app on the browser/device that has the previous records.
2. Use **Export backup** and save the JSON file.
3. Open the new Firebase app, register or sign in, then use **Import backup** at the bottom.
4. Confirm replacing cloud records with the imported backup.

Make the backup **before** changing domains or clearing site data. The old localStorage data remains in the old browser origin unless you delete it. The project does not access or upload it automatically.

## Developer notes

- Firebase SDK: modular client API.
- No Firebase service-account keys or custom backend needed.
- Authentication errors and Firestore sync errors are shown in the app.
- Direct video embeds depend on YouTube's embed availability; where absent, the app links to a technique guide. Videos are not downloaded or hosted by this project.
- `node_modules`, `dist`, and `.env.local` are excluded from Git by `.gitignore`.
# RepLog

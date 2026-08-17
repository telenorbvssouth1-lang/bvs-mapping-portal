# BVS Mapping Portal

A Telenor-branded franchise login portal for submitting BVS mapping data, with
email OTP and live Google Sheets syncing via a Google Apps Script Web App.

## Deploy to Vercel (recommended, free)

1. Go to https://vercel.com and sign up / log in (GitHub login is easiest).
2. Click **Add New... > Project**.
3. Choose **"Deploy without Git"** / drag-and-drop option, or push this
   folder to a new GitHub repo and import it — either works.
4. Vercel auto-detects Vite. Leave build settings as default:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**. You'll get a live URL like `https://bvs-mapping-portal.vercel.app`.

## Run locally first (optional, to test)

```
npm install
npm run dev
```

Then open the local URL it prints (usually http://localhost:5173).

## Notes

- Franchise IDs/passwords and the Apps Script URL are set directly in
  `src/App.jsx` near the top of the file.
- Submissions save to the browser's localStorage as a local cache, and sync
  to your Google Sheet via the Apps Script URL.
- Because this runs as a normal website (not inside Claude's sandbox), the
  OTP email and Sheet sync calls to Google Apps Script will work here even
  though they didn't work as a Claude artifact.

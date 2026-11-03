# Email Verification UI Starter

A responsive frontend starter with a verification modal and an iframe slot for a CAPTCHA challenge supplied by your own authorized backend.

## Run locally
Open `index.html` in a browser, or use any static web server.

## Deploy to GitHub Pages
1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `app.js` to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Backend requirement
GitHub Pages hosts static files only. It cannot run `/api/captcha/session` or `/api/captcha/complete`. Deploy those routes on a secure backend (for example, a server or serverless functions) and set `API_BASE` in `app.js` to that backend's origin.

The backend must:
- create CAPTCHA sessions using the provider's officially supported integration;
- validate completion server-side;
- bind the verification to the user's session;
- rate-limit requests and protect against CSRF;
- call Garena only where you have authorization and are complying with its terms.

This starter intentionally does not collect, forward, or replay DataDome clearance cookies. A browser `postMessage` is only a notification and must not be trusted as proof of a successful CAPTCHA on its own.

## Important
The screenshot appears to show a third-party security challenge. Do not imitate the CAPTCHA itself or ask users to enter account passwords, OTPs, recovery codes, or other secrets into a page that is not operated by the service that owns those credentials.

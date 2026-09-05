# Visitor Number App

A simple web application that assigns a sequential visitor number when a user registers with their **name** and **phone number**.

- The first visitor gets number **1**, the second **2**, etc.
- The same phone number cannot be used to obtain another number.
- Works anywhere in Egypt (and globally) via a free public URL.

## Features
- Node.js + Express server
- SQLite database (file‑based, persistent on Render.com)
- Arabic UI (RTL) for easy use on mobile devices
- Free hosting on **Render.com** (no cost) with optional free custom domain via Freenom

## Project Structure
```
visitor_number_app/
├─ package.json          # npm dependencies and start script
├─ index.js              # Express server and /register endpoint
├─ db.js                 # SQLite helper (addVisitor, findVisitorByPhone)
├─ public/
│   ├─ index.html       # Registration form (Arabic) and result display
│   └─ style.css        # Minimal styling for mobile
└─ README.md            # This file
```

## Prerequisites (for local development)
1. Install **Node.js** (>= 14) and **npm**.
2. Open a terminal and navigate to the project folder.
3. Run:
   ```bash
   npm install
   npm start
   ```
4. Open `http://localhost:3000` in a browser.

## Deploy to Render.com (Free Hosting)
Render provides a free tier that includes a persistent disk, perfect for storing the `visitors.db` SQLite file (handles >500 records easily).

### Steps
1. **Create a GitHub repository** and push the project files (the `visitor_number_app` folder).  
2. Sign up at https://render.com (free account).  
3. Click **New → Web Service** and connect the repository.
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: Render will set `PORT` automatically; the app reads `process.env.PORT`.
   - **Persistent Disk**: enable (default 1 GB, more than enough for 500 rows).
5. Deploy – Render will build and expose a URL like `https://visitor-number-app.onrender.com`.
6. The site is automatically served over HTTPS.

### Optional: Free Custom Domain (Freenom)
If you want a memorable domain (e.g., `myvisit.tk`):
1. Register a free domain at https://freenom.com.
2. In the domain’s DNS settings, add a **CNAME** record pointing to the Render sub‑domain (`visitor-number-app.onrender.com`).
3. After DNS propagation (few minutes), your custom domain will serve the app.

## Database Size Consideration
- Each record stores `id` (INTEGER), `name` (TEXT), `phone` (TEXT). 500 rows occupy < 1 MB.
- Render’s persistent disk guarantees the data survives restarts and deployments.

## Usage
1. Open the public URL (Render sub‑domain or your custom domain) on any device.
2. Fill in **الاسم** (name) and **رقم الهاتف** (phone number).
3. Tap **تسجيل**.
   - If the phone is new, you’ll see `رقمك هو X` where `X` is your sequential number.
   - If the phone was already registered, an alert will inform you that the number is already used.

## Development & Testing
- To run local tests, you can use `curl` or a tool like Postman:
  ```bash
  curl -X POST http://localhost:3000/register \
       -H "Content-Type: application/json" \
       -d '{"name":"Ahmed","phone":"0123456789"}'
  ```
- Expected response: `{ "success": true, "number": 1 }`
- Trying the same phone again returns a `409 Conflict` with an error message.

---

**Enjoy!** If you encounter any issues or need further tweaks (e.g., extra validation, branding), just let me know.

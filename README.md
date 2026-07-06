# InstaClass - Social Classroom & Private Chat Platform

**InstaClass** is a social learning platform that merges **Instagram's visual style** (feed, messaging, profile discovery) with **Google Classroom's structural tools** (classroom channels, note sharing, and interactive doubt verification). 

Designed with a sleek, modern glassmorphic theme, it provides a fully responsive layout with real-time client side databases.

---

## 🚀 Key Features

*   **Google Sign-In Simulation**: Click-through Google login simulation that creates customizable profile databases.
*   **Classroom Management**: Create classrooms to generate random class codes, or join classrooms using codes.
*   **Instagram-Style Study Feed**: Share public note cards (supports codeblocks, markdown paragraphs, and syntax highlights).
*   **Threaded Doubts & Answers**: Post comments under posts to ask doubts. Classmates can post replies, and note authors can toggle a **✓ Verified Solution** badge for clear answers.
*   **Private Direct Messages**: Message classmates by searching their username.
*   **Real-time Cross-Tab Sync**: Utilizes browser state listening to synchronize private chats instantly across multiple open tabs or windows without requiring a backend databas
*   **Search Notes** – Search notes instantly using keywords, authors, or classroom names.
*   **Advanced Search** – Apply multiple search filters to quickly find relevant notes.
*   **Profile Analytics Dashboard** – Visualize contribution statistics, engagement, and recent activity.
*   **Bookmark & Saved Notes** – Save important notes and access them anytime from your collection.
*   **Copy Notes** – Copy note content directly to the clipboard for quick reuse.
*   **Download Notes** – Export notes as text files for offline reading and backup.
---

## 🛠️ Tech Stack

*   **Frontend Library**: React (v19)
*   **Build Bundler**: Vite (v8)
*   **Design System**: Pure Vanilla CSS (Variables, Flexbox, CSS Grid, Glassmorphic surfaces, Keyframe animations)

---

## 📦 Project Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Installation
Clone this repository to your local system and install dependencies:
```bash
git clone <your-repository-url>
cd instaclass
npm install
```

### 2. Development Server
Start the local hot-reloading dev server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Production Build
To build the static files for production hosting (in the `dist` directory):
```bash
npm run build
```

---

## 🐙 How to Upload to GitHub

Follow these steps to initialize Git and upload this project to your GitHub:

### Step 1: Create a Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click **New** to create a repository.
3. Set your repository name (e.g. `instaclass`), select Public or Private, and do **NOT** check "Add a README" (as we already have one).
4. Click **Create repository**.

### Step 2: Push Your Local Code
Open your terminal in the `instaclass` directory and run:
```bash
# Initialize local git repository
git init

# Add all files to staging (our .gitignore keeps node_modules out automatically)
git add .

# Commit changes
git commit -m "initial commit: instaclass social learning platform"

# Rename branch to main
git branch -M main

# Add your GitHub repository link (replace with your actual GitHub link)
git remote add origin https://github.com/<your-username>/<your-repository-name>.git

# Push code to GitHub
git push -u origin main
```

---

## 🌐 Free Deployment (GitHub Pages)

You can easily host this React app on GitHub Pages for free:

1. Install the GitHub Pages deploy utility in your project:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Open `package.json` and add a `homepage` property at the top level:
   ```json
   "homepage": "https://<your-username>.github.io/<your-repository-name>",
   ```
3. In `package.json`, add these scripts under `"scripts"`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run the deploy script in terminal:
   ```bash
   npm run deploy
   ```
This will compile the React app and deploy it instantly.

## 📁 Project Structure

```
instaclass/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🔄 Application Workflow

1. User signs in using the simulated Google login.
2. User creates or joins a classroom.
3. Notes are shared to the classroom feed.
4. Students comment with questions.
5. Other students reply to questions.
6. Note author verifies the best answer.
7. Students communicate using private messaging.

## ✨ Feature Summary

| Feature | Description |
|---------|-------------|
| Authentication | Simulated Google Login |
| Classrooms | Create and Join using Class Code |
| Notes | Markdown and Code Block Support |
| Comments | Threaded Discussions |
| Verified Answers | Author can verify solutions |
| Messaging | Private Chats |
| Responsive UI | Mobile and Desktop Support |

## 🌐 Browser Compatibility

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

## 📸 Screenshots

### Home Feed
![Home Feed](screenshots/home.png)

### Classroom Dashboard
![Dashboard](screenshots/dashboard.png)

### Private Chat
![Chat](screenshots/chat.png)

## 🏗️ Application Architecture

This explains how the application is organized.

---

# 3. 📂 Folder Description

Instead of only showing folders:

```markdown
## 📂 Folder Description

| Folder | Purpose |
|---------|----------|
| public | Static assets |
| src/components | Reusable UI components |
| src/pages | Application pages |
| src/assets | Images and icons |
| src/styles | CSS stylesheets |
| App.jsx | Main application component |
| main.jsx | React entry point |

## ⚙️ Available Scripts

| Command | Description |
|----------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## 📋 System Requirements

- Node.js 18+
- npm 10+
- Modern Web Browser

## 🚀 Future Roadmap

- Firebase Authentication
- Cloud Database
- File Attachments
- Image Uploads
- Voice Messages
- Video Calling
- Notifications
- AI-based Note Summarization

## 🔒 Security Features

- Classroom access using unique class codes
- User profile isolation
- Private one-to-one messaging
- Client-side session management

## 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

## 🎯 Learning Outcomes

This project demonstrates:

- React Development
- Component-Based Design
- State Management
- Responsive UI
- Client-side Data Persistence
- GitHub Collaboration

## 🐞 Troubleshooting
### npm install fails

Delete node_modules and reinstall:

```bash
rm -rf node_modules
npm install

## 📜 License

This project is licensed under the MIT License.

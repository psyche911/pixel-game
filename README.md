# Pixel Art Quiz Game

A retro-style quiz game built with React, Vite, and NES.css, featuring a Google Sheets backend for question management and score tracking.

## Features
- 🎨 **Pixel Art Style**: Retro 8-bit aesthetics using NES.css.
- 📱 **Responsive Design**: Works on desktop and mobile.
- 🚀 **Dynamic Content**: Loads questions from Google Sheets.
- 🖼️ **Avatar Integration**: 100+ unique pixel avatars from DiceBear.
- 📊 **Score Tracking**: Saves high scores and attempts to Google Sheets.

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Locally**
    ```bash
    npm run dev
    ```

---

## 🛠️ Backend Setup: Google Sheets & Apps Script

This game uses Google Sheets as a database. Follow these steps to set it up.

### Step 1: Create the Google Sheet
1.  Go to [Google Sheets](https://sheets.google.com) and create a new sheet.
2.  **Rename** the active sheet (tab) at the bottom to `Questions`.
3.  Create a **second sheet** (click the `+` icon) and rename it to `Answer`.

### Step 2: Configure Columns

**Sheet 1: `Questions`**
Add these headers to the first row:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Question Number** | **Question Title** | **A** | **B** | **C** | **D** | **Answer** |

**Sheet 2: `Answer`**
Add these headers to the first row:
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **ID** | **Total Score** | **Highest Score** | **First Pass Score** | **Number of Attempts** | **Recent Playtime** |

### Step 3: Add the Script (Backend Logic)
1.  In your Google Sheet, click **Extensions** > **Apps Script**.
2.  Delete any code in the `Code.gs` file and paste the following:

```javascript
/* Google Apps Script for Pixel Quiz Game */
const SCRIPT_PROP = PropertiesService.getScriptProperties();

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("key", doc.getId());
}

function doGet(e) {
  // Handle GET requests (fetching questions)
  const action = e.parameter.action;
  if (action === 'getQuestions') {
    return getQuestions(e.parameter.count);
  }
  return ContentService.createTextOutput("Invalid Action");
}

function doPost(e) {
  // Handle POST requests (submitting scores)
  try {
    const data = JSON.parse(e.postData.contents);
    return recordScore(data);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: err.toString()}));
  }
}

function getQuestions(count) {
  const doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  const sheet = doc.getSheetByName("Questions");
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // Remove header row
  
  // Shuffle and select N questions
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count || 5);
  
  const questions = selected.map(row => ({
    id: row[0],
    title: row[1],
    options: [row[2], row[3], row[4], row[5]],
    answer: row[6] 
  }));
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function recordScore(data) {
  const doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  const sheet = doc.getSheetByName("Answer");
  const rows = sheet.getDataRange().getValues();
  const id = data.id.toString(); // Ensure ID is string comparison
  let rowIndex = -1;
  
  // Search for existing user ID
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === id) {
      rowIndex = i + 1; 
      break;
    }
  }
  
  const now = new Date();
  
  if (rowIndex === -1) {
    // New User: Append row
    sheet.appendRow([id, data.score, data.score, data.passed ? data.score : "", 1, now]);
  } else {
    // Existing User: Update stats
    const stats = rows[rowIndex-1];
    const currentHigh = stats[2];
    const firstPass = stats[3];
    const attempts = stats[4] + 1;
    const newHigh = Math.max(currentHigh, data.score);
    const newFirstPass = (firstPass === "" && data.passed) ? data.score : firstPass;
    
    sheet.getRange(rowIndex, 2, 1, 5).setValues([[data.score, newHigh, newFirstPass, attempts, now]]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);
}
```

### Step 4: Deploy the Script
1.  Inside the script editor, click the **Save** icon (disk).
2.  Run the `setup` function **once**:
    - Select `setup` from the dropdown menu (next to "Debug").
    - Click **Run**.
    - Grant the necessary permissions when prompted.
3.  Click **Deploy** (blue button top right) > **New deployment**.
4.  Click the "Select type" gear icon > **Web app**.
5.  Fill in the details:
    - **Description**: Pixel Game API
    - **Execute as**: Me (your email)
    - **Who has access**: **Anyone** (Crucial for the game to work without login)
6.  Click **Deploy**.
7.  **Copy the Web App URL**.

### Step 5: Connect to Game
1.  Open the `.env` file in this project.
2.  Paste your URL:
    ```
    VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
    ```
3.  Restart your local server (`npm run dev`) if it was running.

---

## 🚀 Deployment to GitHub Pages

This project includes a **GitHub Action** to automatically build and deploy the game to GitHub Pages.

### Step 1: Push to GitHub
1.  Initialize git and push your code to a new GitHub repository.

### Step 2: Configure Secrets
1.  Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**.
2.  Click **New repository secret**.
3.  Add the secret:
    - **Name**: `VITE_GOOGLE_APPS_SCRIPT_URL`
    - **Value**: Your Web App URL (ending in `/exec`)
4.  (Optional) Click **Variables** tab > **New repository variable** to adjust game settings:
    - `VITE_PASS_THRESHOLD` (default: 3)
    - `VITE_QUESTION_COUNT` (default: 5)

### Step 3: Enable GitHub Pages
1.  Go to **Settings** > **Pages**.
2.  Under **Build and deployment**, select **Source** as **GitHub Actions**.
3.  The workflow will run automatically on your next push to `main`.

---

## 🤖 Generative AI Fundamentals Questions

Here are 10 questions formatted for the `Questions` sheet:

| Question Number | Question Title | A | B | C | D | Answer |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | What is the core architecture behind most modern LLMs? | CNN | RNN | Transformer | LSTM | Transformer |
| 2 | What is the role of "Temperature" in LLM outputs? | Controls generation speed | Controls randomness | Controls context length | Controls model size | Controls randomness |
| 3 | What is a "Token" in the context of LLMs? | A crypto coin | A user API key | A basic unit of text | A model weight | A basic unit of text |
| 4 | Which technique involves training a model on specific data after initial pre-training? | Fine-tuning | Pre-training | RAG | Zero-shot | Fine-tuning |
| 5 | What does "Hallucination" refer to in AI? | The AI becoming sentient | Generating confident but false info | Crashing due to errors | Seeing images in text | Generating confident but false info |
| 6 | What is RAG? | Retrieval-Augmented Generation | Random Access Generation | Real-time AI Generation | Robot Augmentation Gear | Retrieval-Augmented Generation |
| 7 | Which model type is primarily used for Image Generation? | Transformer | Diffusion Model | Linear Regression | K-Means | Diffusion Model |
| 8 | What is "Zero-shot learning"? | Learning with 0 epochs | Learning from 0 data | Performing tasks without examples | Firing 0 neurons | Performing tasks without examples |
| 9 | What is the Context Window? | The GUI of the AI | The limit of input/output tokens | The training duration | The server latency | The limit of input/output tokens |
| 10 | What is the primary purpose of RLHF? | Aligning AI with human feedback | Increasing training speed | Reducing model size | Adding image capabilities | Aligning AI with human feedback |

# Fillop Study Platform – Online CBT & Examination Platform

**Live Website:** https://study.filloptech.com/

## Project Overview

Fillop Study Platform is an online educational and Computer-Based Testing (CBT) platform designed to help students prepare for major examinations through interactive learning and realistic examination simulations.

The platform provides students with access to examination practice, past questions, timed assessments, and performance evaluation. It aims to make exam preparation more accessible while helping students improve their confidence and academic performance.

The platform supports preparation for major Nigerian examinations, including:

- Joint Admissions and Matriculation Board (JAMB)
- West African Examinations Council (WAEC)
- National Examinations Council (NECO)

## Key Features

### 1. Computer-Based Testing (CBT)
- Simulated computer-based examinations.
- Timed examination sessions.
- Interactive multiple-choice questions.
- Automatic examination submission when time expires.
- Instant examination scoring and results.

### 2. Past Questions & Practice
- Access examination practice questions.
- Practice questions based on different examination categories.
- Improve examination readiness through repeated practice.
- Review answers and assess understanding.

### 3. Student Dashboard
- Personalized student dashboard.
- Access available examinations and study resources.
- Monitor learning and examination activities.
- View examination results and progress.

### 4. Performance Tracking
- View examination scores.
- Review previous examination attempts.
- Monitor academic performance.
- Identify areas that require improvement.

### 5. Subscription & Access Management
- Monthly and yearly subscription plans.
- Premium learning access.
- Controlled access to examination resources.
- Student account and subscription management.

### 6. Responsive User Experience
- Mobile-friendly interface.
- Desktop and tablet compatibility.
- User-friendly navigation.
- Accessible examination experience across devices.

## Technologies Used

- React.js
- JavaScript
- HTML5
- CSS3
- Node.js
- Express.js
- REST API Integration
- MongoDB

*Technology list should be adjusted to match the actual dependencies and backend implementation.*

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following:

- Node.js (LTS recommended)
- npm
- Git
- MongoDB (only if running the backend with a local database)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

If the repository contains both frontend and backend:

```bash
cd FillopsEduTech
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the frontend directory if required.

Example:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If the frontend uses Vite, the variable may instead be:

```env
VITE_API_URL=http://localhost:5000/api
```

Use the variable name expected by the actual application.

### 5. Start the Frontend

For Create React App:

```bash
npm start
```

For Vite:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Start the Backend

If the backend is included in the repository, open another terminal:

```bash
cd backend
npm install
```

Configure the backend environment variables, then start it using the script defined in its `package.json`.

For example:

```bash
npm start
```

## Production Build

To create an optimized frontend production build:

```bash
npm run build
```

The generated build directory depends on the React tooling used by the project.

## Project Structure

The following is an illustrative structure for a full-stack version:

```text
FillopsEduTech/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── backend.js
│   └── package.json
│
└── README.md
```

## My Contribution

My development contributions to this project include:

- Developing the React frontend application.
- Building interactive and responsive user interfaces.
- Implementing student-facing examination

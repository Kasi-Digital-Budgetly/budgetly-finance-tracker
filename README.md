# Budgetly - Personal Finance Tracker

A full-stack personal finance tracker web application to help users manage income, expenses, savings, and financial goals — complete with analytics and a user-friendly dashboard.

---

## Live Demo

- **Frontend:** [https://kasi-budgetly.netlify.app/](https://kasi-budgetly.netlify.app/)  
- **Backend API:** [https://budgetly-api-d8f50ae16cf1.herokuapp.com/](https://budgetly-api-d8f50ae16cf1.herokuapp.com/)

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Available Scripts](#available-scripts)  
- [API Documentation](#api-documentation)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [Team Members & Roles](#team-members--roles)  
- [License](#license)

---

## Features

- User Authentication (Register, Login, Logout) with JWT and secure password hashing  
- CRUD for Transactions (income/expense) with categories and notes  
- Manage Categories (add/delete) for expenses  
- Set and track Financial Goals with progress visualization  
- Analytics dashboard with charts showing spending habits and goals  
- Responsive UI with dark/light theme toggle  
- State management with Redux and React Hooks  
- RESTful API backend built with Node.js, Express, MongoDB, and Mongoose  
- Deployed and accessible online

---

## Tech Stack

- **Frontend:** React, Redux, React Router, React Icons, CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt  
- **Deployment:** Heroku (Backend), Netlify (Frontend)  
- **Testing:** Postman for API testing and documentation

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- npm or yarn  
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/your-org/budgetly.git
   cd budgetly

2. Backend setup

bash
Copy code
cd backend
npm install

3. Create a .env file in the backend folder with the following variables (replace values accordingly):

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api

4. Run backend server
npm run dev

5. Frontend setup (in a new terminal)

cd ../frontend
npm install

6. Create a .env file in the frontend folder with:

VITE_API_BASE_URL=https://budgetly-api-d8f50ae16cf1.herokuapp.com/api

 7. Run frontend app
npm start

8. Open http://localhost:3000 in your browser to view the app.


Available Scripts
Backend
npm run dev — Run backend with nodemon (development)

npm start — Run backend server

Frontend
npm start — Run React frontend in development mode

npm run build — Build optimized production frontend

API Documentation
See the Postman Collection here for detailed API endpoints, request examples, and response schemas.

Key endpoints include:

POST /api/auth/register — User registration

POST /api/auth/login — User login

GET /api/auth/logout — User logout

CRUD /api/transactions — Manage transactions

CRUD /api/categories — Manage categories

CRUD /api/goals — Manage financial goals

Project Structure
bash
Copy code
/backend
  /controllers
  /models
  /routes
  /middleware
  server.js
/frontend
  /src
    /components
    /features (redux slices)
    /pages
    /contexts
    App.jsx
    index.jsx

Team Members & Roles

Name	   Role	     Contributions
Member 1	Frontend Lead	React UI, Redux, routing
Member 2	Backend Lead	API, database schemas, authentication
Member 3	Full-stack Dev	Transactions, categories integration
Member 4	UI/UX Designer	Styling, responsiveness, theming
Member 5	QA & Documentation	Testing, README, API docs
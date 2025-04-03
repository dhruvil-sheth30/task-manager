
# Task Manager Application

A full-stack task management application with user authentication, task organization, and a responsive dashboard.

## Features

- User authentication (signup, login)
- Create, edit, delete, and mark tasks as completed
- Categorize tasks (Work, Personal, Urgent)
- Set priority levels and due dates
- Drag and drop task reordering
- Filter tasks by category and priority
- Dashboard with task statistics and charts
- Dark/Light mode toggle
- Responsive design

## Project Structure

```
/task-manager
├── /frontend                 # React frontend
│   ├── /public               # Static assets
│   ├── /src                  # Source code
│   │   ├── /components       # UI components
│   │   ├── /contexts         # Context providers
│   │   ├── /hooks            # Custom hooks
│   │   ├── /lib              # Utility functions
│   │   └── /pages            # Application pages
│   ├── package.json          # Frontend dependencies
│   └── ...                   # Other config files
│
├── /backend                  # Express.js backend
│   ├── /middleware           # Custom middleware
│   ├── /models               # Mongoose models
│   ├── /routes               # API routes
│   ├── server.js             # Server entry point
│   ├── package.json          # Backend dependencies
│   └── ...                   # Other config files
│
└── README.md                 # This file
```

## Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Router
- Recharts
- Framer Motion
- Tanstack React Query

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt.js

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB account (or local MongoDB installation)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` with your MongoDB connection string and JWT secret.

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API_URL in `src/contexts/TaskContext.tsx` to match your backend URL.

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Task Routes
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/reorder` - Update task ordering

## Deployment

### Backend
The backend can be deployed on platforms like Render, Railway, or Heroku.

### Frontend
The frontend can be deployed on Vercel, Netlify, or GitHub Pages.

## License
This project is licensed under the MIT License.

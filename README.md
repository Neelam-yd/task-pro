TASK PRO

A modern project and task management web app built with Next.js and Node.js.
It helps teams organize projects, track tasks, and collaborate efficiently.

Live Demo:
https://task-pro-iota.vercel.app

FEATURES

Authentication
Secure login and registration using JWT
Project Management
Create, view, and organize projects
Track project status
Task Management
Add tasks
Assign tasks
Track task progress
Dashboard
View all projects and activities in one place
Starred Projects
Mark favourite projects for quick access
Search and Filter
Filter projects by status:
Active
Pending
Completed
Responsive Design
Works on desktop and mobile devices

TECH STACK

Frontend:

Next.js 14
Tailwind CSS
Lucide React

Backend:

Node.js
Express.js
MongoDB
JWT Authentication
CORS

PROJECT STRUCTURE

task-pro/

frontend/

src/
app/
login/
register/
dashboard/
projects/
tasks/
components/
Sidebar.js
package.json

backend/

models/
routes/
server.js
package.json

HOW TO RUN LOCALLY

Prerequisites:

Node.js v18 or above
MongoDB (Local or Atlas)

Step 1: Clone Repository

git clone https://github.com/Neelam-yd/task-pro.git

cd task-pro

Step 2: Setup Backend

cd backend

npm install

Create .env file inside backend folder

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Start backend:

node server.js

Step 3: Setup Frontend

cd frontend

npm install

Create .env.local file

NEXT_PUBLIC_API_URL=http://localhost:5000

Start frontend:

npm run dev

Step 4: Open Browser

http://localhost:3000

DEPLOYMENT

Frontend: Vercel
https://task-pro-iota.vercel.app

Backend: Render
https://task-pro-ed3o.onrender.com


DEMO LOGIN CREDENTIALS

Email: Neelam@gmail.com

Password: 123456


Role: Admin

HOW TO USE

Open the website
https://task-pro-iota.vercel.app
Login using demo credentials
Go to Projects
Create a new project
Go to Tasks
Add new tasks
Mark projects as favourite using star icon
Search projects using search bar
Open Dashboard to view overview

AUTHOR

Neelam

GitHub:
https://github.com/Neelam-yd


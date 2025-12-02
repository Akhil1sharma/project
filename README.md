# Gym Management System - MEAN Stack + AI + Automation

A comprehensive gym management web application built with MEAN stack, integrated with AI capabilities and automation features.

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **AI Integration** - OpenAI, LangChain
- **Automation** - Node-cron, Puppeteer
- **Real-time** - Socket.io

### Frontend
- **Angular 17** - Frontend framework
- **Angular Material** - UI components
- **RxJS** - Reactive programming
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time communication

## Project Structure

```
project/
├── Backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── package.json       # Frontend dependencies
│   ├── angular.json       # Angular configuration
│   └── tsconfig.json      # TypeScript configuration
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)
- Angular CLI (will be installed with dependencies)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd project/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - OpenAI API key (for AI features)
   - Email credentials (for automation)
   - Cloudinary credentials (for file uploads)

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd project/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will run on `http://localhost:4200`

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting

## Features

### Core Features
- Member management
- Membership plans
- Payment tracking
- Attendance monitoring
- Equipment management

### AI Features
- Intelligent workout recommendations
- Personalized fitness plans
- Chatbot assistance
- Predictive analytics

### Automation Features
- Automated email notifications
- Scheduled reports
- Reminder systems
- Data synchronization

## Environment Variables

See `.env.example` in the Backend directory for all required environment variables.

## License

ISC

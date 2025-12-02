# Quick Start Guide - Phase One Backend

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local or cloud instance)
3. **npm** (v9 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
cd project/Backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gym-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4200
```

### 3. Start MongoDB

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod
```

**Mac/Linux:**
```bash
# If installed via Homebrew:
brew services start mongodb-community

# Or start manually:
mongod
```

**MongoDB Atlas (Cloud):**
- Use your MongoDB Atlas connection string in `MONGODB_URI`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
📝 Environment: development
```

### 5. Test the API

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

Or open in browser: `http://localhost:3000/api/health`

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin/Trainer only)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/:id` - Get single exercise
- `POST /api/exercises` - Create exercise (Trainer/Admin only)
- `PUT /api/exercises/:id` - Update exercise (Trainer/Admin only)
- `DELETE /api/exercises/:id` - Delete exercise (Trainer/Admin only)

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout (Trainer/Admin only)
- `PUT /api/workouts/:id` - Update workout (Trainer/Admin only)
- `DELETE /api/workouts/:id` - Delete workout (Trainer/Admin only)

### Diet Plans
- `GET /api/diet-plans` - Get all diet plans
- `GET /api/diet-plans/:id` - Get single diet plan
- `POST /api/diet-plans` - Create diet plan (Trainer/Admin only)
- `PUT /api/diet-plans/:id` - Update diet plan (Trainer/Admin only)
- `DELETE /api/diet-plans/:id` - Delete diet plan (Trainer/Admin only)

## Testing with Postman

See detailed guide: `POSTMAN_TESTING_GUIDE.md`

**Quick Test Flow:**
1. Register an admin user
2. Login and copy the token
3. Use token in Authorization header: `Bearer <token>`
4. Test all endpoints

## Project Structure

```
Backend/
├── models/
│   ├── User.js
│   ├── Exercise.js
│   ├── Workout.js
│   └── DietPlan.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── exerciseController.js
│   ├── workoutController.js
│   └── dietPlanController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── exercises.js
│   ├── workouts.js
│   └── dietPlans.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── utils/
│   └── jwt.js
├── server.js
├── package.json
├── env.example
├── QUICK_START.md
└── POSTMAN_TESTING_GUIDE.md
```

## User Roles

- **admin**: Full access to all endpoints
- **trainer**: Can create/update/delete exercises, workouts, and diet plans
- **member**: Can view public content and manage own profile

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3000

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 7 days (configurable via `JWT_EXPIRE`)

## Next Steps

1. Test all APIs using Postman
2. Verify role-based access control
3. Test error handling and validation
4. Proceed to Phase Two (Frontend development)


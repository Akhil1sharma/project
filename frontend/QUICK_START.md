# Frontend Quick Start Guide

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Backend server running on `http://localhost:3000`

## Installation

```bash
# Navigate to frontend directory
cd project/frontend

# Install dependencies
npm install
```

## Configuration

1. **Environment Configuration**: 
   - File: `src/environments/environment.ts`
   - Default API URL: `http://localhost:3000/api`
   - Update if your backend runs on different port

2. **Optional - Add Runner Image**:
   - Place image at: `src/assets/images/runner.png`
   - Image is optional, app works without it

## Running the Application

```bash
# Start development server
npm start
```

The application will be available at: `http://localhost:4200`

## Default Test Accounts

After registering users via the registration page:

**Admin:**
- Email: admin@gym.com
- Password: admin123

**Trainer:**
- Email: trainer@gym.com
- Password: trainer123

**Member:**
- Email: member@gym.com
- Password: member123

## Features

### Authentication
- Login page with modern design
- Registration page
- JWT token-based authentication
- Role-based access control

### Dashboards
- **Admin Dashboard**: Full access to all features
- **Trainer Dashboard**: Can manage workouts, diet plans, exercises
- **Member Dashboard**: View-only access to public content

### CRUD Operations
- **Members**: Create, read, update, delete (Admin only)
- **Workouts**: Full CRUD (Trainer/Admin)
- **Diet Plans**: Full CRUD (Trainer/Admin)
- **Exercises**: Full CRUD (Trainer/Admin)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Login & Registration
│   │   ├── dashboards/     # Admin, Trainer, Member dashboards
│   │   ├── members/        # Member management
│   │   ├── workouts/       # Workout management
│   │   ├── diet-plans/     # Diet plan management
│   │   └── exercises/      # Exercise management
│   ├── guards/            # Route guards
│   ├── interceptors/     # HTTP interceptors
│   ├── models/            # TypeScript interfaces
│   └── services/          # API services
├── assets/                # Images and static files
├── environments/          # Environment configuration
└── styles.scss           # Global styles
```

## Troubleshooting

### Port Already in Use
```bash
# Use different port
ng serve --port 4201
```

### CORS Errors
- Ensure backend CORS allows `http://localhost:4200`
- Check backend server is running

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
rm -rf .angular
npm start
```

## Development Tips

1. **Hot Reload**: Changes automatically refresh browser
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API calls in browser DevTools
4. **Angular DevTools**: Install Angular DevTools extension for debugging

## Next Steps

1. Test all features using the testing guide
2. Customize styling as needed
3. Add more features in Phase Two
4. Deploy to production

For detailed testing instructions, see `FRONTEND_TESTING_GUIDE.md`


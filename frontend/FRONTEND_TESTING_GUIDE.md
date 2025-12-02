# Frontend Testing Guide - Gym Management System

## Prerequisites

1. **Backend Server Running**: Ensure the backend API is running on `http://localhost:3000`
2. **Node.js & npm**: Node.js v18+ and npm v9+
3. **Angular CLI**: Will be installed with dependencies

## Setup Instructions

### 1. Install Dependencies

```bash
cd project/frontend
npm install
```

### 2. Configure Environment

The API URL is configured in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Make sure this matches your backend server URL.

### 3. Add Runner Image (Optional)

Place a runner/fitness image at:
```
src/assets/images/runner.png
```

If the image is not available, the login page will still work but the image won't display.

### 4. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Testing Workflow

### Step 1: Access Login Page

1. Open browser and navigate to `http://localhost:4200`
2. You should see the login page with:
   - Left panel: Purple gradient with Fit.Fine logo
   - Right panel: White login form

### Step 2: Register New Users

1. Click "Register as new user" button
2. Fill in the registration form:
   - First Name: John
   - Last Name: Admin
   - Email: admin@gym.com
   - Password: admin123
   - Role: Admin
3. Click "Register"
4. You should be redirected to the Admin Dashboard

**Repeat for:**
- Trainer: trainer@gym.com / trainer123
- Member: member@gym.com / member123

### Step 3: Test Login

1. Logout from current session
2. Go to login page
3. Enter credentials:
   - Email: admin@gym.com
   - Password: admin123
4. Click "Login"
5. Should redirect to appropriate dashboard based on role

### Step 4: Test Admin Dashboard

**Features to test:**
- Sidebar navigation (Members, Workouts, Diet Plans, Exercises)
- View all members list
- Create new member
- Edit member
- Delete member
- View workouts list
- Create/edit/delete workouts
- View diet plans list
- Create/edit/delete diet plans
- View exercises list
- Create/edit/delete exercises

**Test Cases:**
1. **Members Management:**
   - Navigate to Members
   - Click "Add Member"
   - Fill form and submit
   - Verify member appears in list
   - Edit member details
   - Delete member

2. **Workouts Management:**
   - Navigate to Workouts
   - Click "Add Workout"
   - Fill form (name, type, difficulty, duration)
   - Submit and verify in list
   - Edit workout
   - Delete workout

3. **Diet Plans Management:**
   - Navigate to Diet Plans
   - Click "Add Diet Plan"
   - Fill form (name, goal, duration, calories)
   - Submit and verify
   - Edit diet plan
   - Delete diet plan

4. **Exercises Management:**
   - Navigate to Exercises
   - Click "Add Exercise"
   - Fill form (name, category, difficulty, equipment)
   - Submit and verify
   - Edit exercise
   - Delete exercise

### Step 5: Test Trainer Dashboard

1. Login as trainer (trainer@gym.com / trainer123)
2. Verify sidebar shows:
   - Workouts
   - Diet Plans
   - Exercises
   - Members (view only)
3. Test CRUD operations for:
   - Workouts (can create/edit/delete)
   - Diet Plans (can create/edit/delete)
   - Exercises (can create/edit/delete)
   - Members (view only, cannot edit/delete)

### Step 6: Test Member Dashboard

1. Login as member (member@gym.com / member123)
2. Verify sidebar shows:
   - Workouts
   - Diet Plans
3. Test features:
   - View public workouts
   - View public diet plans
   - Cannot create/edit/delete (buttons should not appear)

### Step 7: Test Authentication & Authorization

**Authentication Tests:**
- Try accessing `/admin` without login → Should redirect to login
- Try accessing `/trainer` without login → Should redirect to login
- Try accessing `/member` without login → Should redirect to login
- Login and verify token is stored
- Logout and verify token is cleared

**Authorization Tests:**
- Login as member, try to access `/admin` → Should redirect to `/member`
- Login as trainer, try to access `/admin` → Should redirect to `/trainer`
- Login as admin, can access all dashboards

**Role-Based UI Tests:**
- Member cannot see "Add" buttons for workouts/diet plans
- Trainer cannot see "Add Member" button
- Admin can see all "Add" buttons

### Step 8: Test Form Validation

**Login Form:**
- Submit empty form → Should show validation errors
- Enter invalid email → Should show email error
- Enter password < 6 chars → Should show password error

**Registration Form:**
- Submit empty form → Should show validation errors
- Enter mismatched passwords → Should show error
- Enter invalid email → Should show email error

**CRUD Forms:**
- Submit empty forms → Should show validation errors
- Required fields should be marked with asterisk
- Error messages should display below fields

### Step 9: Test Error Handling

**Network Errors:**
- Stop backend server
- Try to login → Should show error message
- Try to load list → Should show error message

**API Errors:**
- Try to register with existing email → Should show error
- Try to delete non-existent item → Should show error
- Try to access unauthorized endpoint → Should show error

### Step 10: Test Responsive Design

**Desktop (1920px+):**
- Full sidebar visible
- Two-column layout on login/register
- Tables display all columns

**Tablet (768px - 1024px):**
- Sidebar may collapse
- Forms adjust to single column
- Tables may scroll horizontally

**Mobile (< 768px):**
- Sidebar hidden or drawer
- Single column layout
- Login left panel hidden
- Forms stack vertically

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure backend CORS is configured to allow `http://localhost:4200`

### Issue: 401 Unauthorized
**Solution**: 
- Check if token is being sent in headers
- Verify token hasn't expired
- Try logging in again

### Issue: Blank Page
**Solution**:
- Check browser console for errors
- Verify all dependencies are installed
- Check if backend is running

### Issue: Images Not Loading
**Solution**:
- Verify `runner.png` exists in `src/assets/images/`
- Check browser console for 404 errors
- Image is optional, app will work without it

### Issue: Forms Not Submitting
**Solution**:
- Check form validation errors
- Verify backend API is running
- Check browser console for errors
- Verify network tab for API calls

## Testing Checklist

- [ ] Login page displays correctly
- [ ] Registration form works
- [ ] Login redirects to correct dashboard
- [ ] Admin dashboard shows all menus
- [ ] Trainer dashboard shows correct menus
- [ ] Member dashboard shows correct menus
- [ ] Members list loads and displays
- [ ] Can create new member
- [ ] Can edit member
- [ ] Can delete member
- [ ] Workouts list loads
- [ ] Can create/edit/delete workouts
- [ ] Diet plans list loads
- [ ] Can create/edit/delete diet plans
- [ ] Exercises list loads
- [ ] Can create/edit/delete exercises
- [ ] Role-based access control works
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Logout works
- [ ] Responsive design works on mobile

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Next Steps

After testing:
1. Document any bugs found
2. Test with real backend data
3. Test performance with large datasets
4. Test accessibility features
5. Proceed to Phase Two features

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## API Integration

All API calls are made through:
- `AuthService` - Authentication endpoints
- `ApiService` - All CRUD operations

API base URL: `http://localhost:3000/api`

Endpoints used:
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user
- GET/POST/PUT/DELETE `/users` - User management
- GET/POST/PUT/DELETE `/workouts` - Workout management
- GET/POST/PUT/DELETE `/diet-plans` - Diet plan management
- GET/POST/PUT/DELETE `/exercises` - Exercise management


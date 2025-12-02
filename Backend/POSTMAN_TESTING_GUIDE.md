# Postman Testing Guide - Gym Management API

## Prerequisites

1. **MongoDB Running**: Ensure MongoDB is running on your system
   - Default: `mongodb://localhost:27017/gym-management`
   - Or update `MONGODB_URI` in `.env` file

2. **Environment Variables**: Create a `.env` file in the Backend directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/gym-management
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:4200
   ```

3. **Start the Server**:
   ```bash
   cd project/Backend
   npm install
   npm run dev
   ```
   Server should run on `http://localhost:3000`

4. **Postman Setup**:
   - Create a new Collection: "Gym Management API"
   - Create an Environment: "Gym Management Local"
   - Add environment variables:
     - `base_url`: `http://localhost:3000`
     - `token`: (will be set automatically after login)

---

## Testing Workflow

### Step 1: Health Check
**GET** `{{base_url}}/api/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

### Step 2: Register Users

#### 2.1 Register Admin
**POST** `{{base_url}}/api/auth/register`

**Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Admin",
  "email": "admin@gym.com",
  "password": "admin123",
  "role": "admin",
  "phone": "1234567890"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Action**: Copy the `token` and save it to environment variable `admin_token`

---

#### 2.2 Register Trainer
**POST** `{{base_url}}/api/auth/register`

**Body (JSON):**
```json
{
  "firstName": "Mike",
  "lastName": "Trainer",
  "email": "trainer@gym.com",
  "password": "trainer123",
  "role": "trainer",
  "phone": "1234567891",
  "specialization": ["strength", "cardio"],
  "experience": 5
}
```

**Action**: Copy the `token` and save it to environment variable `trainer_token`

---

#### 2.3 Register Member
**POST** `{{base_url}}/api/auth/register`

**Body (JSON):**
```json
{
  "firstName": "Alice",
  "lastName": "Member",
  "email": "member@gym.com",
  "password": "member123",
  "role": "member",
  "phone": "1234567892",
  "dateOfBirth": "1990-01-01",
  "gender": "female",
  "membershipPlan": "premium"
}
```

**Action**: Copy the `token` and save it to environment variable `member_token`

---

### Step 3: Login

#### 3.1 Login as Admin
**POST** `{{base_url}}/api/auth/login`

**Body (JSON):**
```json
{
  "email": "admin@gym.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Admin",
      "email": "admin@gym.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 3.2 Login as Trainer
**POST** `{{base_url}}/api/auth/login`

**Body (JSON):**
```json
{
  "email": "trainer@gym.com",
  "password": "trainer123"
}
```

---

#### 3.3 Login as Member
**POST** `{{base_url}}/api/auth/login`

**Body (JSON):**
```json
{
  "email": "member@gym.com",
  "password": "member123"
}
```

---

### Step 4: Get Current User
**GET** `{{base_url}}/api/auth/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "role": "..."
  }
}
```

---

## Users API

### Get All Users (Admin/Trainer only)
**GET** `{{base_url}}/api/users`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters (Optional):**
- `role`: Filter by role (member, trainer, admin)
- `isActive`: Filter by active status (true/false)
- `search`: Search by name or email

**Example:**
```
GET {{base_url}}/api/users?role=member&isActive=true
```

---

### Get Single User
**GET** `{{base_url}}/api/users/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Note**: Members can only view their own profile

---

### Create User (Admin only)
**POST** `{{base_url}}/api/users`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body (JSON):**
```json
{
  "firstName": "New",
  "lastName": "User",
  "email": "newuser@gym.com",
  "password": "password123",
  "role": "member",
  "phone": "1234567893"
}
```

---

### Update User
**PUT** `{{base_url}}/api/users/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Note**: Members can only update their own profile. Only admin can change role.

---

### Delete User (Admin only)
**DELETE** `{{base_url}}/api/users/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## Exercises API

### Get All Exercises
**GET** `{{base_url}}/api/exercises`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters (Optional):**
- `category`: Filter by category (cardio, strength, flexibility, balance, sports, other)
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `equipment`: Filter by equipment type
- `search`: Search by name or description
- `isActive`: Filter by active status

**Example:**
```
GET {{base_url}}/api/exercises?category=strength&difficulty=beginner
```

---

### Get Single Exercise
**GET** `{{base_url}}/api/exercises/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### Create Exercise (Trainer/Admin only)
**POST** `{{base_url}}/api/exercises`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

**Body (JSON):**
```json
{
  "name": "Push Up",
  "description": "Classic bodyweight exercise for chest and arms",
  "category": "strength",
  "muscleGroups": ["chest", "triceps", "shoulders"],
  "equipment": "bodyweight",
  "difficulty": "beginner",
  "instructions": [
    "Start in plank position",
    "Lower body until chest nearly touches floor",
    "Push back up to starting position"
  ],
  "caloriesPerMinute": 8
}
```

---

### Update Exercise (Trainer/Admin only)
**PUT** `{{base_url}}/api/exercises/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

**Body (JSON):**
```json
{
  "description": "Updated description",
  "difficulty": "intermediate"
}
```

---

### Delete Exercise (Trainer/Admin only)
**DELETE** `{{base_url}}/api/exercises/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

---

## Workouts API

### Get All Workouts
**GET** `{{base_url}}/api/workouts`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters (Optional):**
- `type`: Filter by type (strength, cardio, hiit, yoga, pilates, crossfit, custom)
- `difficulty`: Filter by difficulty
- `isPublic`: Filter by public status
- `createdBy`: Filter by creator ID
- `search`: Search by name or description

**Note**: Members can only see public workouts or their own

---

### Get Single Workout
**GET** `{{base_url}}/api/workouts/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### Create Workout (Trainer/Admin only)
**POST** `{{base_url}}/api/workouts`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

**Body (JSON):**
```json
{
  "name": "Full Body Strength",
  "description": "Complete full body workout",
  "type": "strength",
  "difficulty": "intermediate",
  "duration": 60,
  "isPublic": true,
  "exercises": [
    {
      "exercise": "EXERCISE_ID_1",
      "sets": 3,
      "reps": 12,
      "restTime": 60,
      "order": 1
    },
    {
      "exercise": "EXERCISE_ID_2",
      "sets": 3,
      "reps": 10,
      "restTime": 90,
      "order": 2
    }
  ],
  "estimatedCalories": 300,
  "tags": ["full-body", "strength"]
}
```

**Note**: Replace `EXERCISE_ID_1` and `EXERCISE_ID_2` with actual exercise IDs from previous requests

---

### Update Workout (Trainer/Admin only)
**PUT** `{{base_url}}/api/workouts/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

---

### Delete Workout (Trainer/Admin only)
**DELETE** `{{base_url}}/api/workouts/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

---

## Diet Plans API

### Get All Diet Plans
**GET** `{{base_url}}/api/diet-plans`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters (Optional):**
- `goal`: Filter by goal (weight_loss, weight_gain, muscle_gain, maintenance, endurance, general_health)
- `isPublic`: Filter by public status
- `createdBy`: Filter by creator ID
- `search`: Search by name or description

---

### Get Single Diet Plan
**GET** `{{base_url}}/api/diet-plans/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### Create Diet Plan (Trainer/Admin only)
**POST** `{{base_url}}/api/diet-plans`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

**Body (JSON):**
```json
{
  "name": "Weight Loss Plan",
  "description": "7-day weight loss diet plan",
  "goal": "weight_loss",
  "duration": 7,
  "dailyCalories": 1500,
  "dailyMacros": {
    "protein": 120,
    "carbs": 150,
    "fats": 50
  },
  "meals": [
    {
      "mealType": "breakfast",
      "time": "08:00",
      "items": [
        {
          "name": "Oatmeal",
          "quantity": "1 cup",
          "calories": 150,
          "protein": 5,
          "carbs": 27,
          "fats": 3
        },
        {
          "name": "Banana",
          "quantity": "1 medium",
          "calories": 105,
          "protein": 1,
          "carbs": 27,
          "fats": 0
        }
      ]
    },
    {
      "mealType": "lunch",
      "time": "12:00",
      "items": [
        {
          "name": "Grilled Chicken Breast",
          "quantity": "150g",
          "calories": 231,
          "protein": 43,
          "carbs": 0,
          "fats": 5
        }
      ]
    }
  ],
  "restrictions": ["gluten-free"],
  "isPublic": true,
  "tags": ["weight-loss", "low-calorie"]
}
```

---

### Update Diet Plan (Trainer/Admin only)
**PUT** `{{base_url}}/api/diet-plans/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

---

### Delete Diet Plan (Trainer/Admin only)
**DELETE** `{{base_url}}/api/diet-plans/:id`

**Headers:**
```
Authorization: Bearer {{trainer_token}}
```

---

## Testing Tips

### 1. Token Management
- After login, copy the token from response
- Set it in Postman environment variable
- Use `{{token}}` in Authorization header as `Bearer {{token}}`

### 2. Testing Role-Based Access
- Try accessing admin-only endpoints with member token (should get 403)
- Try accessing trainer-only endpoints with member token (should get 403)
- Members should only see public workouts/diet plans or their own

### 3. Error Testing
- Try registering with duplicate email (should get 400)
- Try accessing protected route without token (should get 401)
- Try accessing with invalid token (should get 401)
- Try accessing non-existent resource (should get 404)

### 4. Validation Testing
- Try creating user without required fields (should get 400)
- Try creating exercise with invalid category (should get 400)
- Try creating workout with non-existent exercise ID (should get 400)

---

## Postman Collection Setup

### Environment Variables
Create a Postman Environment with:
- `base_url`: `http://localhost:3000`
- `admin_token`: (set after admin login)
- `trainer_token`: (set after trainer login)
- `member_token`: (set after member login)

### Collection Structure
```
Gym Management API
├── Authentication
│   ├── Register Admin
│   ├── Register Trainer
│   ├── Register Member
│   ├── Login Admin
│   ├── Login Trainer
│   ├── Login Member
│   └── Get Me
├── Users
│   ├── Get All Users
│   ├── Get User
│   ├── Create User
│   ├── Update User
│   └── Delete User
├── Exercises
│   ├── Get All Exercises
│   ├── Get Exercise
│   ├── Create Exercise
│   ├── Update Exercise
│   └── Delete Exercise
├── Workouts
│   ├── Get All Workouts
│   ├── Get Workout
│   ├── Create Workout
│   ├── Update Workout
│   └── Delete Workout
└── Diet Plans
    ├── Get All Diet Plans
    ├── Get Diet Plan
    ├── Create Diet Plan
    ├── Update Diet Plan
    └── Delete Diet Plan
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution**: Ensure MongoDB is running and `MONGODB_URI` is correct in `.env`

### Issue: 401 Unauthorized
**Solution**: Check if token is valid and properly set in Authorization header

### Issue: 403 Forbidden
**Solution**: Check if user role has permission for the endpoint

### Issue: 400 Bad Request
**Solution**: Check request body format and required fields

### Issue: 404 Not Found
**Solution**: Verify the resource ID exists in database

---

## Next Steps

After testing all APIs successfully:
1. Verify all CRUD operations work correctly
2. Test role-based access control
3. Test validation and error handling
4. Document any issues found
5. Proceed to Phase Two development


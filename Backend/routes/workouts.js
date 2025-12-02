const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getWorkouts)
  .post(authorize('trainer', 'admin'), createWorkout);

router.route('/:id')
  .get(getWorkout)
  .put(authorize('trainer', 'admin'), updateWorkout)
  .delete(authorize('trainer', 'admin'), deleteWorkout);

module.exports = router;


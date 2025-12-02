const express = require('express');
const router = express.Router();
const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getExercises)
  .post(authorize('trainer', 'admin'), createExercise);

router.route('/:id')
  .get(getExercise)
  .put(authorize('trainer', 'admin'), updateExercise)
  .delete(authorize('trainer', 'admin'), deleteExercise);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  validateGymCode,
  getMyGym,
  getGym,
  updateGym,
  getGymUsers,
  updateUserStatus,
  getGymStatistics,
  deleteGymUser
} = require('../controllers/gymController');
const { protect, authorize } = require('../middleware/auth');

// Public route - validate gym code
router.get('/validate/:gymCode', validateGymCode);

// Protected routes - require authentication
router.use(protect);

// Get current user's gym
router.get('/my-gym', getMyGym);

// Admin only routes
router.get('/statistics', authorize('admin'), getGymStatistics);
router.get('/users', authorize('admin'), getGymUsers);
router.put('/users/:userId/status', authorize('admin'), updateUserStatus);
router.delete('/users/:userId', authorize('admin'), deleteGymUser);

// Gym management routes
router.route('/:id')
  .get(authorize('admin'), getGym)
  .put(authorize('admin'), updateGym);

module.exports = router;

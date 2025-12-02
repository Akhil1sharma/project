const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(authorize('admin', 'trainer'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;


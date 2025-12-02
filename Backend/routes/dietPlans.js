const express = require('express');
const router = express.Router();
const {
  getDietPlans,
  getDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan
} = require('../controllers/dietPlanController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getDietPlans)
  .post(authorize('trainer', 'admin'), createDietPlan);

router.route('/:id')
  .get(getDietPlan)
  .put(authorize('trainer', 'admin'), updateDietPlan)
  .delete(authorize('trainer', 'admin'), deleteDietPlan);

module.exports = router;


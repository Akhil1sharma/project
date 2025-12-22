const DietPlan = require('../models/DietPlan');

// @desc    Get all diet plans
// @route   GET /api/diet-plans
// @access  Private
exports.getDietPlans = async (req, res, next) => {
  try {
    const { goal, search, isPublic, createdBy } = req.query;
    
    // Build query - ALWAYS filter by gymId for multi-tenancy
    const query = { gymId: req.user.gymId };
    
    if (goal) {
      query.goal = goal;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }
    
    if (createdBy) {
      query.createdBy = createdBy;
    }
    
    // Members can only see public diet plans or their own
    if (req.user.role === 'member') {
      query.$or = [
        { isPublic: true },
        { createdBy: req.user._id }
      ];
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const dietPlans = await DietPlan.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dietPlans.length,
      data: dietPlans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single diet plan
// @route   GET /api/diet-plans/:id
// @access  Private
exports.getDietPlan = async (req, res, next) => {
  try {
    const dietPlan = await DietPlan.findOne({ _id: req.params.id, gymId: req.user.gymId })
      .populate('createdBy', 'firstName lastName email');

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Members can only view public diet plans or their own
    if (req.user.role === 'member' && 
        !dietPlan.isPublic && 
        dietPlan.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this diet plan'
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create diet plan
// @route   POST /api/diet-plans
// @access  Private (Trainer, Admin)
exports.createDietPlan = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    req.body.gymId = req.user.gymId;
    
    // Calculate total calories for meals if not provided
    if (req.body.meals && req.body.meals.length > 0) {
      req.body.meals.forEach(meal => {
        if (meal.items && meal.items.length > 0) {
          meal.totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0);
        }
      });
    }
    
    const dietPlan = await DietPlan.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      data: dietPlan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update diet plan
// @route   PUT /api/diet-plans/:id
// @access  Private (Trainer, Admin)
exports.updateDietPlan = async (req, res, next) => {
  try {
    let dietPlan = await DietPlan.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Only creator or admin can update
    if (dietPlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this diet plan'
      });
    }

    // Recalculate meal calories if meals are updated
    if (req.body.meals && req.body.meals.length > 0) {
      req.body.meals.forEach(meal => {
        if (meal.items && meal.items.length > 0) {
          meal.totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0);
        }
      });
    }

    dietPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Diet plan updated successfully',
      data: dietPlan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete diet plan
// @route   DELETE /api/diet-plans/:id
// @access  Private (Trainer, Admin)
exports.deleteDietPlan = async (req, res, next) => {
  try {
    const dietPlan = await DietPlan.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Only creator or admin can delete
    if (dietPlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this diet plan'
      });
    }

    await DietPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


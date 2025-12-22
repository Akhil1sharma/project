const Exercise = require('../models/Exercise');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
exports.getExercises = async (req, res, next) => {
  try {
    const { category, difficulty, equipment, search, isActive } = req.query;
    
    // Build query - ALWAYS filter by gymId for multi-tenancy
    const query = { gymId: req.user.gymId };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (equipment) {
      query.equipment = equipment;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const exercises = await Exercise.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise
// @route   GET /api/exercises/:id
// @access  Private
exports.getExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, gymId: req.user.gymId })
      .populate('createdBy', 'firstName lastName email');

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create exercise
// @route   POST /api/exercises
// @access  Private (Trainer, Admin)
exports.createExercise = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    req.body.gymId = req.user.gymId;
    const exercise = await Exercise.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private (Trainer, Admin)
exports.updateExercise = async (req, res, next) => {
  try {
    let exercise = await Exercise.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Only creator or admin can update
    if (exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exercise'
      });
    }

    exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully',
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private (Trainer, Admin)
exports.deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Only creator or admin can delete
    if (exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exercise'
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


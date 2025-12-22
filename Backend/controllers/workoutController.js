const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res, next) => {
  try {
    const { type, difficulty, search, isPublic, createdBy } = req.query;
    
    // Build query - ALWAYS filter by gymId for multi-tenancy
    const query = { gymId: req.user.gymId };
    
    if (type) {
      query.type = type;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }
    
    if (createdBy) {
      query.createdBy = createdBy;
    }
    
    // Members can only see public workouts or their own
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

    const workouts = await Workout.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, gymId: req.user.gymId })
      .populate('createdBy', 'firstName lastName email')
      .populate('exercises.exercise');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Members can only view public workouts or their own
    if (req.user.role === 'member' && 
        !workout.isPublic && 
        workout.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this workout'
      });
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create workout
// @route   POST /api/workouts
// @access  Private (Trainer, Admin)
exports.createWorkout = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    req.body.gymId = req.user.gymId;
    
    // Validate exercises exist
    if (req.body.exercises && req.body.exercises.length > 0) {
      for (const exerciseItem of req.body.exercises) {
        const exercise = await Exercise.findById(exerciseItem.exercise);
        if (!exercise) {
          return res.status(400).json({
            success: false,
            message: `Exercise with ID ${exerciseItem.exercise} not found`
          });
        }
      }
    }
    
    const workout = await Workout.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private (Trainer, Admin)
exports.updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Only creator or admin can update
    if (workout.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    // Validate exercises if provided
    if (req.body.exercises && req.body.exercises.length > 0) {
      for (const exerciseItem of req.body.exercises) {
        const exercise = await Exercise.findById(exerciseItem.exercise);
        if (!exercise) {
          return res.status(400).json({
            success: false,
            message: `Exercise with ID ${exerciseItem.exercise} not found`
          });
        }
      }
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .populate('createdBy', 'firstName lastName email')
    .populate('exercises.exercise');

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private (Trainer, Admin)
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, gymId: req.user.gymId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Only creator or admin can delete
    if (workout.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


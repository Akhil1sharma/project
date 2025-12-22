const Gym = require('../models/Gym');
const User = require('../models/User');

// @desc    Get gym details by gym code
// @route   GET /api/gyms/validate/:gymCode
// @access  Public
exports.validateGymCode = async (req, res, next) => {
  try {
    const { gymCode } = req.params;

    if (!gymCode) {
      return res.status(400).json({
        success: false,
        message: 'Gym code is required'
      });
    }

    const gym = await Gym.getByCode(gymCode);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Invalid gym code'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        gymName: gym.gymName,
        gymCode: gym.gymCode,
        isValid: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's gym details
// @route   GET /api/gyms/my-gym
// @access  Private
exports.getMyGym = async (req, res, next) => {
  try {
    const gym = await Gym.findById(req.user.gymId)
      .populate('ownerId', 'firstName lastName email');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Update statistics before returning
    await gym.updateStatistics();

    res.status(200).json({
      success: true,
      data: gym
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gym by ID
// @route   GET /api/gyms/:id
// @access  Private (Admin only)
exports.getGym = async (req, res, next) => {
  try {
    // Only allow admin to view gym details
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can view gym details'
      });
    }

    // Ensure admin can only view their own gym
    if (req.params.id !== req.user.gymId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this gym'
      });
    }

    const gym = await Gym.findById(req.params.id)
      .populate('ownerId', 'firstName lastName email');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    await gym.updateStatistics();

    res.status(200).json({
      success: true,
      data: gym
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gym details
// @route   PUT /api/gyms/:id
// @access  Private (Admin only)
exports.updateGym = async (req, res, next) => {
  try {
    // Only allow admin to update gym
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can update gym details'
      });
    }

    // Ensure admin can only update their own gym
    if (req.params.id !== req.user.gymId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gym'
      });
    }

    const { gymName, email, phone, address, settings, branding, subscriptionPlan } = req.body;

    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Prevent updating gymCode and ownerId
    if (gymName) gym.gymName = gymName;
    if (email) gym.email = email;
    if (phone) gym.phone = phone;
    if (address) gym.address = { ...(gym.address || {}), ...address };
    if (settings) gym.settings = { ...gym.settings, ...settings };
    if (branding) gym.branding = { ...gym.branding, ...branding };
    if (subscriptionPlan) gym.subscriptionPlan = subscriptionPlan;

    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Gym updated successfully',
      data: gym
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gym members and trainers
// @route   GET /api/gyms/users
// @access  Private (Admin only)
exports.getGymUsers = async (req, res, next) => {
  try {
    // Only allow admin to view gym users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can view gym users'
      });
    }

    const { role, isActive, search } = req.query;

    // Build query
    const query = { gymId: req.user.gymId };

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gym user status
// @route   PUT /api/gyms/users/:userId/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    // Only allow admin to update user status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can update user status'
      });
    }

    const { isActive } = req.body;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, gymId: req.user.gymId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in your gym'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gym statistics
// @route   GET /api/gyms/statistics
// @access  Private (Admin only)
exports.getGymStatistics = async (req, res, next) => {
  try {
    // Only allow admin to view statistics
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can view statistics'
      });
    }

    const gym = await Gym.findById(req.user.gymId);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    await gym.updateStatistics();

    // Get additional statistics
    const Workout = require('../models/Workout');
    const Exercise = require('../models/Exercise');
    const DietPlan = require('../models/DietPlan');

    const totalWorkouts = await Workout.countDocuments({ gymId: req.user.gymId });
    const totalExercises = await Exercise.countDocuments({ gymId: req.user.gymId });
    const totalDietPlans = await DietPlan.countDocuments({ gymId: req.user.gymId });

    res.status(200).json({
      success: true,
      data: {
        users: gym.statistics,
        content: {
          totalWorkouts,
          totalExercises,
          totalDietPlans
        },
        subscription: {
          plan: gym.subscriptionPlan,
          status: gym.subscriptionStatus,
          startDate: gym.subscriptionStartDate,
          endDate: gym.subscriptionEndDate
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gym user
// @route   DELETE /api/gyms/users/:userId
// @access  Private (Admin only)
exports.deleteGymUser = async (req, res, next) => {
  try {
    // Only allow admin to delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only gym admins can delete users'
      });
    }

    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, gymId: req.user.gymId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in your gym'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin accounts'
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

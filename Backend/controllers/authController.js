const User = require('../models/User');
const Gym = require('../models/Gym');
const { generateToken } = require('../utils/jwt');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      phone, 
      dateOfBirth, 
      gender,
      gymCode,
      gymName,
      gymAddress,
      gymPhone,
      gymEmail
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstName, lastName, email, password, and role'
      });
    }

    // Validate role
    if (!['admin', 'trainer', 'member'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, trainer, or member'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    let gym;
    let newGym = false;

    // Handle different registration scenarios based on role
    if (role === 'admin') {
      // Admin creating a new gym
      if (!gymName) {
        return res.status(400).json({
          success: false,
          message: 'Gym name is required for admin registration'
        });
      }

      // Generate unique gym code
      const generatedGymCode = await Gym.generateGymCode(gymName);

      // Create new gym
      gym = await Gym.create({
        gymName,
        gymCode: generatedGymCode,
        ownerId: null, // Will be updated after user creation
        email: gymEmail || email,
        phone: gymPhone || phone,
        address: gymAddress || {},
        subscriptionStatus: 'trial'
      });

      newGym = true;
    } else {
      // Trainer or Member joining existing gym
      if (!gymCode) {
        return res.status(400).json({
          success: false,
          message: 'Gym code is required for trainer and member registration'
        });
      }

      // Validate gym code
      gym = await Gym.getByCode(gymCode);
      
      if (!gym) {
        return res.status(404).json({
          success: false,
          message: 'Invalid gym code. Please check and try again.'
        });
      }

      // Check gym capacity limits

      if (role === 'member') {
        const memberCount = await User.countDocuments({ gymId: gym._id, role: 'member' });
        if (memberCount >= gym.settings.maxMembers) {
          return res.status(400).json({
            success: false,
            message: 'Gym has reached maximum member capacity'
          });
        }
      } else if (role === 'trainer') {
        const trainerCount = await User.countDocuments({ gymId: gym._id, role: 'trainer' });
        if (trainerCount >= gym.settings.maxTrainers) {
          return res.status(400).json({
            success: false,
            message: 'Gym has reached maximum trainer capacity'
          });
        }
      }
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      dateOfBirth,
      gender,
      gymId: gym._id,
      joinedGymAt: new Date()
    });

    // If admin, update gym's ownerId
    if (role === 'admin' && newGym) {
      gym.ownerId = user._id;
      await gym.save();
    }

    // Update gym statistics
    await gym.updateStatistics();

    // Generate token
    const token = generateToken(user._id, user.role, gym._id);

    // Prepare response
    const responseData = {
      user,
      token
    };

    // Include gym code for admin registration
    if (role === 'admin' && newGym) {
      responseData.gymCode = gym.gymCode;
      responseData.message = `Gym created successfully! Your gym code is: ${gym.gymCode}. Share this code with trainers and members.`;
    }

    res.status(201).json({
      success: true,
      message: role === 'admin' 
        ? 'Gym and admin account created successfully' 
        : `Successfully registered as ${role}`,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role, user.gymId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gymId: user.gymId
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};


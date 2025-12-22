const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true
  },
  gymCode: {
    type: String,
    required: [true, 'Gym code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [6, 'Gym code must be at least 6 characters'],
    maxlength: [12, 'Gym code must not exceed 12 characters']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Gym owner is required']
  },
  email: {
    type: String,
    required: [true, 'Gym email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'USA'
    }
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'trial'],
    default: 'trial'
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date
  },
  settings: {
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    maxMembers: {
      type: Number,
      default: 100
    },
    maxTrainers: {
      type: Number,
      default: 10
    },
    allowPublicSignup: {
      type: Boolean,
      default: true
    },
    requireAdminApproval: {
      type: Boolean,
      default: false
    }
  },
  branding: {
    logo: {
      type: String
    },
    primaryColor: {
      type: String,
      default: '#667eea'
    },
    secondaryColor: {
      type: String,
      default: '#764ba2'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statistics: {
    totalMembers: {
      type: Number,
      default: 0
    },
    totalTrainers: {
      type: Number,
      default: 0
    },
    activeMembers: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
gymSchema.index({ gymCode: 1 });
gymSchema.index({ ownerId: 1 });
gymSchema.index({ isActive: 1 });

// Method to generate unique gym code
gymSchema.statics.generateGymCode = async function (gymName) {
  // Generate code from gym name (first 3 letters) + random 3 digits
  const prefix = gymName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const suffix = Math.floor(100 + Math.random() * 900); // 3 random digits
  let gymCode = `${prefix}${suffix}`;

  // Ensure uniqueness
  let exists = await this.findOne({ gymCode });
  while (exists) {
    const newSuffix = Math.floor(100 + Math.random() * 900);
    gymCode = `${prefix}${newSuffix}`;
    exists = await this.findOne({ gymCode });
  }

  return gymCode;
};

// Method to validate gym code
gymSchema.statics.validateGymCode = async function (gymCode) {
  const gym = await this.findOne({ gymCode: gymCode.toUpperCase(), isActive: true });
  return !!gym;
};

// Method to get gym by code
gymSchema.statics.getByCode = async function (gymCode) {
  return await this.findOne({ gymCode: gymCode.toUpperCase(), isActive: true });
};

// Update statistics when queried
gymSchema.methods.updateStatistics = async function () {
  const User = mongoose.model('User');

  const totalMembers = await User.countDocuments({ gymId: this._id, role: 'member' });
  const totalTrainers = await User.countDocuments({ gymId: this._id, role: 'trainer' });
  const activeMembers = await User.countDocuments({ gymId: this._id, role: 'member', isActive: true });

  this.statistics = {
    totalMembers,
    totalTrainers,
    activeMembers
  };

  await this.save();
};

module.exports = mongoose.model('Gym', gymSchema);

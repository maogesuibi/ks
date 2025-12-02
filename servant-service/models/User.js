const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true
    },
    cookie: {
        type: String,
        required: true
    },
    lastQueryTime: {
        type: Date,
        default: Date.now
    },
    queryCount: {
        type: Number,
        default: 0
    },
    isNewUser: {
        type: Boolean,
        default: true
    },
    accountStatus: {
        status: {
            type: String,
            enum: ['normal', 'warning', 'danger', 'excellent', 'great'],
            default: 'normal'
        },
        message: String,
        color: String,
        icon: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 更新时间戳
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const queryRecordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    cookie: {
        type: String,
        required: true
    },
    queryTime: {
        type: Date,
        default: Date.now
    },
    result: {
        success: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: {}
        },
        error: String
    },
    ipAddress: String,
    userAgent: String
});

module.exports = mongoose.model('QueryRecord', queryRecordSchema);
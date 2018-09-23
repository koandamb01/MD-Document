const mongoose = require('./mongoose');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "*Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [emailRegex, "*Email address is invalid"]
    },
    first_name: {
        type: String,
        required: [true, "*FirstName is requied"],
        minlength: [2, '*Must be at least 2 characters']
    },
    last_name: {
        type: String,
        required: [true, "*LastName is requied"],
        minlength: [2, '*Must be at least 2 characters']
    },
    user_name: {
        type: String,
        required: [true, "*UserName is requied"],
        minlength: [2, '*Must be at least 2 characters']
    },
    password: {
        type: String,
        required: [true, "*Password is requied"]
    }

}, { timestamps: true });

var ChatSchema = new mongoose.Schema({
    user: UserSchema,
    message: String,
}, { timestamps: true });


DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Document title is required"],
        minlength: [2, '*Must be at least 2 characters']
    },
    content: String,
    Users: [UserSchema],
    Chats: [ChatSchema]
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: "Email already exists in the system" });

module.exports = {
    User: mongoose.model('User', UserSchema),
    Chat: mongoose.model('Chat', ChatSchema),
    Document: mongoose.model('Document', DocumentSchema),
}

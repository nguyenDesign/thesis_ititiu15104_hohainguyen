const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // remove white space at the beginning and end
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    phone:{
        type: Number,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    managed_by:{
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    monthly_quest:[],
    isSubmit:{
        type:Boolean,
        default: false
    }
})

// Hiden private data 
userSchema.method.toJSON = function(){
    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Login services
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login: cannot find user email')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login: password is not correct')
    }

    return user
}

//Generate tokens for authentications
userSchema.methods.generateAuthToken = async function () {
    const user = this
    
    if (user.role.toString() == 'admin'){
        const token = jwt.sign({ _id: user._id.toString() }, 'thisisadmin')
        user.tokens = user.tokens.concat({ token })
        await user.save()

        return token
    }
    
}
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    if (user.role == "doctor" || user.role == "admin"){
        user.managed_by = "None"
    }
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
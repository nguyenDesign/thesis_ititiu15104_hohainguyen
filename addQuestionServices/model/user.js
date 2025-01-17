const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
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
    
    role:{
        type:String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    
    if (user.role.toString() == 'admin'){
        const token = jwt.sign({ _id: user._id.toString() }, 'thisisadmin')
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    }
    if (user.role.toString() == 'doctor'){
        const token = jwt.sign({ _id: user._id.toString() }, 'thisisdoctor')
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    } 
    if (user.role.toString() == 'patient'){
        const token = jwt.sign({ _id: user._id.toString() }, 'thisispatient')
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    } 
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email:email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
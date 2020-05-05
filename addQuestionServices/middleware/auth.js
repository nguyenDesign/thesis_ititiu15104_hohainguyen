const jwt = require('jsonwebtoken')
const User = require('../model/user')
const auth = async (req, res, next) => {
    try {
        const token = req.cookies["auth_token"]
        const decoded = jwt.verify(token, 'thisisdoctor')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).redirect('/api/addQuestion/login')
    }
}

module.exports = auth
const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/users', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })

mongoose.connect('mongodb://host.docker.internal:27017/users',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
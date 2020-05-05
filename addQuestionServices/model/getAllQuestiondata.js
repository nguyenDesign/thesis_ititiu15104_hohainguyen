const connection = require('../db/mysql')

const getAllQuestiondata = (callback)=>{
    connection.query("select * from question",(err,contents)=>{
        if (err) callback(err,undefined)
        else{
            callback(undefined,contents)
        }
    })
}
module.exports = getAllQuestiondata
const connection = require("../db/mysql")
const getQuestiondata = (id,callback)=>{
    sql = "select * from question where id = "+id
    connection.query(sql,(error,result)=>{
        if (error){
            callback(error,undefined)
        }else{
            callback(undefined,result)
        }
    })
}

module.exports = getQuestiondata
const connection = require("../db/mysql")
const deleteQuestion = (id,response)=>{
    sql = "delete from answer where q_id = "+id
    connection.query(sql,(error,result)=>{
        if (error) throw error
    })
    sql = "delete from question where id = "+id
    connection.query(sql,(error,result)=>{
        if (error) throw error
    })
    response.redirect("/api/addQuestion/manage")
}

module.exports = deleteQuestion
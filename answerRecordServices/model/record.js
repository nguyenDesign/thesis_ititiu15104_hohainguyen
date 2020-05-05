const connection = require('../db/mysql')

const getrecord = async (email)=>{
    return new Promise ((resolve,reject)=>{
        sql = 'select * from answer_record where email = '+ "\'"+email+ "\'"
        connection.query(sql,(err,result)=>{
            resolve(JSON.parse(JSON.stringify(result)))
        })
        
    })
    connection.query()
}

module.exports = getrecord
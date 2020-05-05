const connection = require('../db/mysql')

const getrecord = async (email)=>{
    return new Promise ((resolve,reject)=>{
        sql = 'select * from answer_record where managed_by = '+ "\'"+email+ "\'"
        connection.query(sql,(err,result)=>{
            if (err){
                console.log('No patient record')
            }
            resolve(JSON.parse(JSON.stringify(result)))
        })
        
    })
    connection.query()
}

module.exports = getrecord
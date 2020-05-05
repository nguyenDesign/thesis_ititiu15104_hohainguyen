const connection = require('../db/mysql')
answer_sql = 'select * from answer'
const getAnswer =  ()=>{
    return new Promise((resolve,reject)=>{
        connection.query(answer_sql,(error,result)=>{
            
            aList = []
            result.forEach(element => {
                a= {
                    q_id: -1,
                    content: '',
                    point: ''
                }
                a.q_id = element.q_id
                a.content = element.content
                a.point = element.point
                aList.push(a)
            });
            resolve(aList)
        })
    })
}

module.exports = getAnswer
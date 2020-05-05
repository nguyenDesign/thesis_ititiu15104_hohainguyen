const connection = require('../db/mysql')

const getDailyQuestion = async () =>{
    return new Promise ((resolve,reject)=>{
        question_sql = 'select * from question where type = \'Daily\' order by RAND() limit 5'
    
        connection.query(question_sql,(error,result)=>{
       
        qList = []
        result.forEach(element => {
                q = {
                    id: -1,
                    content: '',
                    type:''
                }
                q.id = element.id
                q.content = element.content
                q.type = element.type
                qList.push(q)
            });
        resolve(qList)
        })
    })
    
}

module.exports = getDailyQuestion
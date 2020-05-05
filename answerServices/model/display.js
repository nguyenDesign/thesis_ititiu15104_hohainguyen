const connection = require('../db/mysql')
const display = (qList,aList) =>{
    return new Promise((resolve,reject)=>{
       
        data = []
        qList.forEach(q =>{
            qa = {
                id: -1,
                question:'',
                type:'',
                answer: []
            }
            
            qa.id = q.id
            qa.question = q.content
            qa.type = q.type
            aList.forEach(a =>{
                if (a.q_id == q.id){
                    qa.answer.push(a)
                }
            })
            data.push(qa)
        })
        resolve(data)
    })
}

module.exports = display


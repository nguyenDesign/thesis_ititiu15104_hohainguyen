const connection = require('../db/mysql')

const editQuestion = (id,info)=>{
    questionset = info.questionset
    content = info.content
    answer1 = info.answer1
    answer2 = info.answer2
    answer3 = info.answer3
    answer4 = info.answer4
    point1 = info.point1
    point2 = info.point2
    point3 = info.point3
    point4 = info.point4
    
    //Indetify question set
    switch(questionset){
        case 'Monthly':
            quest_type = 'Monthly'
            break;
        case 'Weekly':
            quest_type = 'Weekly'
            break;
        case 'Daily':
            quest_type = 'Daily'
            break;
    }
    
    // UPDATE `questiondata`.`question` SET `content` = 'How do you feel today', `type` = 'Daily' WHERE (`id` = '2');
    q_sql = "update question set content = \'" +content+ "\',type = \'"+quest_type+ "\' where id ="+id
    connection.query(q_sql,(err,result)=>{
        if (err) console.log(err)
    })
    // Delete old answer    
    connection.query('delete from answer where q_id ='+id)
    // Create new answer 
    answer_data = [
        [id,answer1,point1],
        [id,answer2,point2],
        [id,answer3,point3],
        [id,answer4,point4]
    ]
    const query2 = "INSERT INTO answer(q_id, content, point) VALUES ?"
    connection.query(query2,[answer_data],function(err,items){
        if (err) throw err
       
    })
}

module.exports = editQuestion
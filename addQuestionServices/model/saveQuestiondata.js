const connection = require('../db/mysql')

const saveQuestiondata = (info,response)=>{
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
    
    if (answer3.length == 0){
        answer3 = ''
        point3 = 0
    }else if (answer3.length > 0 && point3 < 1){
        point3 = 0
    }

    if (answer4.length == 0){
        answer4 = ''
        point4 = 0
    }else if (answer4.length > 0 && point4 < 1){
        point4 = 0
    }
    //Indetify question set
    switch(questionset){
        case 'Monthly':
            quest_type = 'Monthly'
            break;
        case 'Daily':
            quest_type = 'Daily'
            break;
    }
    
    //Save question content and question set 
    let question_data = {content:content,type:quest_type}
    
    input_question = "INSERT INTO question SET ?"
    
    connection.query(input_question,question_data,function(err,items){
        if (err) throw err
    })

    //Save data into answer table
    connection.query("select id from question order by id desc limit 1",function(err,result){
        if (err) throw err    
        q_id = result[0].id
        
        answer_data = [
            [q_id,answer1,point1],
            [q_id,answer2,point2],
            [q_id,answer3,point3],
            [q_id,answer4,point4]
        ]
        const query2 = "INSERT INTO answer(q_id, content, point) VALUES ?"
        connection.query(query2,[answer_data],function(err,items){
            if (err) throw err
           
        })
    }) 
    response.redirect('/api/addQuestion')

}

module.exports = saveQuestiondata

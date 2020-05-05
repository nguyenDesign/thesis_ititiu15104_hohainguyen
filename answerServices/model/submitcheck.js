connection = require('../db/mysql')

const submitcheck = async (isSubmit)=>{
    return new Promise ((resolve,reject)=>{
        if (isSubmit == true){
            connection.query('select * from clock', async function(err,res){
                if (err) throw err
                saveDay = res[0].day
                saveMonth = res[0].month
                saveYear = res[0].year
                let date = new Date()
                currentDay = date.getDate()
                currentMonth = date.getMonth() + 1
                currentYear = date.getFullYear()
                if (currentYear > saveYear){
                    isSubmit = false
                }else if (currentMonth > saveMonth){
                    isSubmit = false
                }else if (currentDay > saveDay){
                    isSubmit = false
                }
                sql = "update clock set day = \'" +currentDay+ "\',month = \'"+currentMonth+ "\',year = \'"+currentYear+"\' where id ="+res[0].id
                connection.query(sql)
                resolve(isSubmit)
            })
        }else{
            resolve(isSubmit)
        }
    })
}

module.exports = submitcheck
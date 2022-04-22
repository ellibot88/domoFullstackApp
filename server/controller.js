require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')
const axios = require('axios')


const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const config = {
    headers: {
      Authorization: 'Basic MmNmMzhkNWYtZTg4My00NjQ0LTk5MDQtMTU2MTQ2MDBiOGRkOjRhNzk1MTExYTE1NzVjYTJhMTRmYmMwMDllN2FiYmJmZmMyOGQ3ZTVlYzc0MjlhNDk2ZDAzNjc1NjE0MzljYjQ=',
    }
  }

module.exports = {
    getDomoCreds: (req,res) =>{
        axios.post('https://api.domo.com/oauth/token?grant_type=client_credentials&scope=data%20user',{},config)
        .then(response => {
            sequelize.query(`
            
            drop table if exists domo_creds;

            create table domo_creds(
              bearer_token varchar
            
            );
            
            insert into domo_creds(bearer_token)
            values('${response.data.access_token}');`)
            .then(res.status(200).send(response.data.access_token))
            .catch(err => console.log(err))
            
        })
        .catch(err => console.log(err.data))

    },
    queryData: (req,res) =>{
        // console.log(req.body)
        const {datasetId, query} = req.body
        sequelize.query(`select * from domo_creds;`)
        .then(dbRes => {
            const config2 = {
                headers: {
                  Authorization: `Bearer ${dbRes[0][0].bearer_token}`,
                }
              } 
            axios.post(`https://api.domo.com/v1/datasets/query/execute/${datasetId}`,{"sql": query},config2)
            .then(response => {
                const name = 'a' + response.data.datasource.substring(0, 8)
                console.log(name)
                sequelize.query(`drop table if exists ${name};

                create table ${name}(
                col1 varchar,
                col2 varchar,
                col3 varchar,
                col4 varchar,
                col5 varchar
                );
                `)
                .then(() => {
                    for(let i = 0; i< response.data.rows.length;i++){
                        sequelize.query(`insert into ${name} (col1,col2,col3,col4,col5)
                        values('${response.data.rows[i][0]}','${response.data.rows[i][1]}','${response.data.rows[i][2]}','${response.data.rows[i][3]}','${response.data.rows[i][4]}')`)
                        .then()
                        .catch()
                    }
                    res.status(200).send(`Success! You inserted ${response.data.numRows} rows into table ${name}`)
                })
                .catch(err => console.log(err))
               })
            .catch(err => console.log(err.data))
        })
        .catch()
        

    } ,
    insertData: (req,res) =>{

    }

}
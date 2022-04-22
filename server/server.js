require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT, CONNECTION_STRING} = process.env

const {
    getDomoCreds,
    queryData,
    insertData
} = require('./controller.js')

app.use(express.json())
app.use(cors())

app.get('/authorize', getDomoCreds)
app.post('/querydata', queryData)
app.post('/insertdata', insertData)



app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))
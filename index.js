require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const router = require('./router')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT;

const app = express()
app.use(fileUpload({}))
app.use(express.json())
app.use(express.static('static'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log('success at ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

start()

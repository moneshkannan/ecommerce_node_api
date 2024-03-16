const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config()
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute')
const { notFound, errorHandler } = require('./middlewares/errorHandler');
dbConnect();

app.use(morgan("dev"))
app.use(cookieParser())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)
app.use(notFound)
app.use(errorHandler)
app.use("/",(req, res) => {
    res.send("Hola from server")
})
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
})
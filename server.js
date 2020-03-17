const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://root:1986@blog-shard-00-00-eip6j.mongodb.net:27017,blog-shard-00-01-eip6j.mongodb.net:27017,blog-shard-00-02-eip6j.mongodb.net:27017/test?ssl=true&replicaSet=blog-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

app.use(fileUpload())


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    //console.log(articles)
    res.render('articles/index', { articles: articles})
})

app.use('/articles/', articleRouter)

app.listen(process.env.PORT || 5000)
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const app = express()

mongoose.connect('mongodb://root:1986@blog-shard-00-00-eip6j.mongodb.net:27017,blog-shard-00-01-eip6j.mongodb.net:27017,blog-shard-00-02-eip6j.mongodb.net:27017/test?ssl=true&replicaSet=blog-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', { articles: articles})
})

app.use('/articles/', articleRouter)

app.listen(process.env.PORT || 5000)
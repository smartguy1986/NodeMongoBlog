const express = require('express')

const mongoose = require('mongoose').set('debug', true)
mongoose.connect('mongodb://root:1986@blog-shard-00-00-eip6j.mongodb.net:27017,blog-shard-00-01-eip6j.mongodb.net:27017,blog-shard-00-02-eip6j.mongodb.net:27017/test?ssl=true&replicaSet=blog-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})

const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/:id', (req, res) => {
    const arijit = req.params.id
    const article2 = Article.findById(req.params.id)
    //if (article == null) res.redirect('/')
    res.render('articles/show', { article: article2 })
})

router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    }
    catch (e) {
        console.log(e)
        res.render('articles/new', { article: article })
    }

})

module.exports = router
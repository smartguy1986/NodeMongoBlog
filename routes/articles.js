const express = require('express')
const ObjectId = require('mongodb').ObjectID;
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/:slug', async (req, res) => {
    //const arijit = ObjectId(req.params.id)    
    const article2 = await Article.findOne({ 'slug': req.params.slug})
    console.log(article2)
    //if (article == null) res.redirect('/')
    res.render('articles/show', { article: article2 })
})

router.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        slug: req.body.slug,
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    }
    catch (e) {
        console.log(e)
        res.render('articles/new', { article: article })
    }

})

module.exports = router
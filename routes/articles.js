const express = require('express')
const ObjectId = require('mongodb').ObjectID;
const Article = require('./../models/article')
const router = express.Router()



router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
    const article2 = await Article.findOne({ 'slug': req.params.slug })
    if (article2 == null) {
        res.redirect('/')
    }
    res.render('articles/show', { article: article2 })
})

router.post('/', async (req, res, next) => {
    console.log(req.files);
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        console.log(req.body.oldimage)
        // ============================================
        if (req.files.featuredimage.name) {
            if (req.article.oldimage) {
                fs.unlink('./public/uploads/' + req.body.oldimage, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
                var file = req.files.featuredimage,
                    name = file.name,
                    type = file.mimetype
                var uploadpath = './public/uploads/' + name
                file.mv(uploadpath, function (err) {
                    if (err) {
                        console.log("File Upload Failed", name, err)
                    }
                    else {
                        console.log("File Uploaded", name)
                    }
                })
                var imageName = req.files.featuredimage.name
            }
            else {
                var file = req.files.featuredimage,
                    name = file.name,
                    type = file.mimetype
                var uploadpath = './public/uploads/' + name
                file.mv(uploadpath, function (err) {
                    if (err) {
                        console.log("File Upload Failed", name, err)
                    }
                    else {
                        console.log("File Uploaded", name)
                    }
                })
                var imageName = req.files.featuredimage.name
            }
        }
        else {
            if (req.body.oldimage) {
                var imageName = req.body.oldimage
            }
            else {
                var imageName = ""
            }
        }
        // ============================================
        console.log(req.files.featuredimage.name)
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.featuredimage = imageName
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router
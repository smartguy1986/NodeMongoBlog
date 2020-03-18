const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

mongoose.connect('mongodb://root:1986@blog-shard-00-00-eip6j.mongodb.net:27017,blog-shard-00-01-eip6j.mongodb.net:27017,blog-shard-00-02-eip6j.mongodb.net:27017/test?ssl=true&replicaSet=blog-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    // sanitizedHTML:{
    //     type: String,
    //     required: true,
    // },
    featuredimage:{
        type: String,
        required: false,
    },
    oldimage:{
        type: String,
    }
})

articleSchema.pre('validate', function(){
    if(this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
    }

    // if(this.markdown){
    //     this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
    // }
})

module.exports = mongoose.model('Article', articleSchema)
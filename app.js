const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const ejs = require('ejs');
const app = express();
app.set('view engine', ejs);
app.use(bodyParser.urlencoded({ extedned: true }));
app.use(express.static("public"));

// Connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/wikiDB', (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected to DB");
    }
});
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(result);
            }
        }
        )
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Article saved");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Successfully deleted all the articles");
            }
        })
    })

// Requests targeting specific article \\

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, doc) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(doc);
            }
        })
    })
    .put((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { title: req.params.articleTitle, body: req.params.body }, { owerwrite: true }, (err) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Article updated");
            }

        })
    })
    .patch((req,res)=>{
        console.log(req.body);
        Article.update(
            {title:req.params.articleTitle},
            {$set:req.body},
            (err,results)=>{
            if(err){
                res.send(err);
                console.log(err);
            }
            else{
                res.send("Article updated successfully");
            }
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitle},(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(" Article Deleted successfully");
            }
        })
    })
    ;


app.listen(3000, (req, res) => {
    console.log("listening on   port 3000");
});
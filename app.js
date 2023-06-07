// Here we are creating a new REST full API wiki-api using the REST structure
// REST : REpresentational State Transfer  
//jshint esversion:6
// Postman is created all type(get,post,delete,put,patch) of http request for the server to database comunication or Testing your own REST api using postman
// Studio 3T is used for the store the database onl you need to connect your server to the Studio 3T using the url string

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {

    title: String,
    content: String
};

const articles = mongoose.model("articles", articleSchema);

//You can create chainable route handlers for a route path by using app.route().Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos.
// Note : When your all http request is carrrying a same location of the route root thath time you can used the app.route handler


/////////////////////////////////////////////Request Targeting for all article/////////////////////////////////////////////

app.route("/articles")

    // Here fetch all the artcles into the database collection using the http get verbs request (Here server communicate with the wikiDB database)

    .get(function (req, res) {

        articles.find()
            .then(function (foundArticles) {
                res.send(foundArticles); // This is used for the send the data directly to the /articles root 
            })
            .catch(function (err) {
                console.log(err);
            })
    })

    // Here Creating a only one new article using the http post verb request (Here also server is creating a new datadocument and added into the database)

    .post(function (req, res) { // You can also all the sended ejs templets of geting all data and create a new articles

        const newArticle = new articles({ // Here created a only one article for the articles website

            title: req.body.title,
            content: req.body.content
        });

        newArticle.save()
            .then(function () { // This data send to the server

                res.send("Sucessfuly added articles");
            })
            .catch(function (err) {

                res.send(err);
            })
    })

    // Here make a delete request for the delete the all the articles into the database using the rest api

    .delete(function (req, res) {

        articles.deleteMany()
            .then(function () {

                res.send("SucessFully Deleted all the data");
            })
            .catch(function (err) {

                res.send(err);
            })
    })


/////////////////////////////////////////////Request Targeting a specifice article/////////////////////////////////////////////


app.route("/articles/:articleTitle")

    // Here get a specific article into the database using the get http request

    .get(function (req, res) {

        const articleTitle = req.params.articleTitle;

        articles.find({ title: articleTitle })
            .then(function (foundArticle) {

                res.send(foundArticle);
            })
            .catch(function (err) {

                res.send(err);
            })
    })

    // Put request is update the entire document of the database 

    .put(function (req, res) {

        articles.findOneAndUpdate(

            { title: req.params.articleTitle }, // condition
            { title: req.body.title, content: req.body.content }, // update content
            { overwrite: true })  // overwrite permision
            .then(function () {

                res.send("Sucessfully Updated Data using Put");
            })
            .catch(function (err) {

                res.send(err);
            })
    })

    // Patch request is update the specifiec document field and value or It is not a update the entire docunent

    .patch(function (req, res) {

        // articles.findOneAndUpdate(
        //     { title: req.params.articleTitle },
        //     { title: req.body.title },
        //     { overwrite: true })
        //     .then(function () {

        //         res.send("Successfuly updated data using patch");
        //     })
        //     .catch(function (err) {

        //         res.send(err);
        //     })

        ////// or//////

        articles.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body }) // Here geting the all body object field and value
            .then(function () {

                res.send("Successfuly updated data using patch");
            })
            .catch(function (err) {

                res.send(err);
            })
    })

    // Delete request is used for the deleted a specific article into the database

    .delete(function (req, res) {

        articles.findOneAndDelete(
            { title: req.params.articleTitle })
            .then(function () {

                res.send("SuccessFully Deleted particular article using Delete")
            })
            .catch(function (err) {

                res.send(err);
            })
    })


//TODO

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.npr.org/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            var number = 0;

            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .find(".title")
                    .text();
                result.teaser = $(this)
                    .find(".teaser")
                    .text();
                result.link = $(this)
                    .find("a")
                    .attr("href");

                if (result.title && result.teaser && result.link) {

                    // Create a new Article using the `result` object built from scraping
                    db.article.updateOne({ link: result.link }, result, { upsert: true, setDefaultsOnInsert: true })
                        .then(function (dbArticle) {
                            // View the added result in the console
                            // number++;
                            // if (i === ($("article").length - 1)) {
                            //     // Send a message to the client
                            //     console.log("ended up with ", number);
                            //     res.send({ numArticles: number });
                            // }
                        })
                        .catch(function (err) {
                            // If an error occurred, log it
                            console.log(err);
                        });
                    number++;
                    // console.log("articles are here", result.title, result.teaser, result.link);
                }
                if (i === ($("article").length - 1)) {
                    // Send a message to the client
                    console.log("ended up with ", number);
                    res.send({ numArticles: number });
                }
            });

        });
    });
    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.render("index", { articles: dbArticle });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    app.post("/savedarticle", function (req, res) {

        // Grab every document in the Articles collection
        db.article.updateOne({ link: req.body.link }, { savedArticle: true })
            .then(function (dbArticle) {
                res.json(dbArticle);
                // If we were able to successfully find Articles, send them back to the client
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.delete("/deletedarticle", function (req, res) {

        // Grab every document in the Articles collection
        db.article.updateOne({ link: req.body.link }, { savedArticle: false })
            .then(function (dbArticle) {
                res.json(dbArticle);
                // If we were able to successfully find Articles, send them back to the client
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post("/articleNotes", function (req, res) {
        // console.log(req);
        // Create a new note and pass the req.body to the entry
        db.articlenotes.create({ title: "note title", body: req.body.note })
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.article.findOneAndUpdate({ link: req.body.link }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/articleSavedNotes/:notesID", function (req, res) {
        // console.log(req);
        db.articlenotes.findById(req.params.notesID)
            .then(function (note) {
                console.log(note);
                // If we were able to successfully update an Article, send it back to the client
                res.json(note);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

}
var db = require("../models");

module.exports = function (app) {
    // Load index page
    app.get("/", function (req, res) {
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
    
    app.get("/saved", function (req, res) {
        db.article.find({ savedArticle: true })
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.render("savedarticles", { articles: dbArticle });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });
}
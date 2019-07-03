# All-the-News-That-s-Fit-to-Scrape

created a news app, where you can scrape new articles, saved the desired ones, write a note to a particular article and delete this article from saved ones

# Steps to use
1. open the home page
2. click on Scrape new Articles button
3. check for the articles to pop up with the titles, links, teasers.
4. Click on Save Article button
5. click on the Saved Article in the navigation bar
6. check all your saved articles there
7. click on Add Note Button 
8. Write some note and click Save Changes button
9. or click on Delete Article button 

# tech in use
var express = require("express");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var path = require("path");
var db = require("../models");
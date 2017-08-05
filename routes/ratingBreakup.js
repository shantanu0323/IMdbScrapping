var express = require('express');
var router = express.Router();
var movie = require('./index');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


var render;
var endUrl;
var title;

/* GET home page. */
router.get('/', function (req, res, next) {
    endUrl = req.param('titlecode');
    render = function () {
        var ratings = require('../ratings.json');
        res.render('ratingBreakup', {
            title: title,
            sha: 'Shantanu',
            titleCode: endUrl,
            data: ratings
        });
    }
    scrape(render);
});

function scrape(req, res, callback) {

    // For hollywood movies
    url = "http://www.imdb.com" + endUrl + "ratings";

    // For indian movies
    // url = "http://www.imdb.com" + endUrl + "ratings";

    console.log('Retrieving content from ' + url + "................\n");
    console.log('Please Wait ........ \n');


    request(url, function (error, response, html) {
        var json = {};
        if (!error) {
            var $ = cheerio.load(html);

            $('#tn15main').filter(function () {
                var data = $(this);
                title = data.children().eq(1).children().children().eq(1).text();
                for (var i = 0; i < 10; i++) {

                    json["rating" + (10-i)] = data.children().eq(2).children().eq(5).children().children().eq(i+1).children().eq(0).text();
                    json["percent" + (10-i)] = data.children().eq(2).children().eq(5).children().children().eq(i+1).children().eq(1).text().trim();

                }
            })

        }

        // render();
        fs.writeFile('ratings.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the ratings.json file');
            render();
        });
    });
}

module.exports = router;


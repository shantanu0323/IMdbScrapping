var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var connect = require('connect');
var obj = {} // empty Object
var key = 'Top250Movies';

var render;
/* GET home page. */
router.get('/', function (req, res, next) {
    scrape(render);
    render = function () {
        var output = require('../output.json');
        res.render('index', {
            title: 'Top 250 IMdB Movies',
            data: output,
            sha: 'Shantanu'
        });
    }

});

function scrape(req, res, callback) {

    // For hollywood movies
    url = 'http://www.imdb.com/chart/top/';

    // For indian movies
    // url = 'http://www.imdb.com/india/top-rated-indian-movies/';

    console.log('Retrieving content from ' + url + "................\n");
    console.log('Please Wait ........ \n');

    obj[key] = []; // empty Array, in which we are push()ing values into


    request(url, function (error, response, html) {
        var titlecodes = "";
        if (!error) {
            var $ = cheerio.load(html);

            $('.lister-list').filter(function () {

                var data = $(this);
                for (var i = 0; i < 250; i++) {

                    var json = {};
                    json.rank = data.children().eq(i).children().eq(1).text().trim().split("\n", 1)[0];
                    json.title = data.children().eq(i).children().eq(1).children().eq(0).text();
                    json.titleCode = data.children().eq(i).children().eq(1).children().eq(0).attr('href').split("?", 1)[0];
                    json.year = data.children().eq(i).children().eq(1).children().eq(1).text().replace("(", "").replace(")", "");
                    json.director = data.children().eq(i).children().eq(1).children().eq(0).attr('title').split(" (", 1)[0];
                    json.rating = data.children().eq(i).children().eq(2).children().eq(0).text();
                    json.posterURL = data.children().eq(i).children().eq(0).children().eq(5).children().eq(0).attr('src');
                    json.link = "http://www.imdb.com" + data.children().eq(i).children().eq(1).children().eq(0).attr('href');

                    obj[key].push(json);

                    if (i==0) {
                        titlecodes = titlecodes + json.titleCode;
                    } else {
                        titlecodes = titlecodes + "\n" + json.titleCode;
                    }
                }
            })

        }

        fs.writeFile("titlecodes.txt", titlecodes, function (err) {
            console.log("File 'titlecodes' has been successfully written...");
        });

        fs.writeFile('output.json', JSON.stringify(obj, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
            render();
        });
    });
}


module.exports = router;

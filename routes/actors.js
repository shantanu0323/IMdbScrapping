var express = require('express');
var router = express.Router();
var movie = require('./index');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var render;
var endUrl;
var title;
var director;
var done = false;
var cast;
fs.

/* GET home page. */
router.get('/', function (req, res, next) {
    endUrl = req.param('titlecode');
    render = function () {
        while (!done) {
        }
        res.render('actors', {
            title: title,
            director: director,
            sha: 'Shantanu',
            titleCode: endUrl,
            data: cast
        });
    }
    scrape(render);
});

function scrape(req, res, callback) {

    // For hollywood movies
    url = "http://www.imdb.com" + endUrl + "fullcredits";

    // For indian movies
    // url = "http://www.imdb.com" + endUrl + "ratings";

    console.log('Retrieving content from ' + url + "................\n");
    console.log('Please Wait ........ \n');


    request(url, function (error, response, html) {
        console.log('starting function');
        var json = {};
        if (!error) {
            var $ = cheerio.load(html);


            $('#main').filter(function () {
                var data = $(this);
                title = "Shantanu";
                title = data.children().eq(0).children().eq(1).children().eq(1).children().eq(0).children().eq(0).text();
                console.log('title = "' + title + '"');

                var cast = {};
                cast.title = title;
                director = {};
                director.name = data.children().eq(0).children().eq(2).children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(0).text().trim();
                director.link = "http://www.imdb.com" + data.children().eq(0).children().eq(2).children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(0).attr('href').trim();
                console.log('director = "' + director + '"');
                cast.director = director;
                actors = [];
                i = 1;
                while (true) {
                    actor = {};
                    actor.name = data.children().eq(0).children().eq(2).children().eq(5).children().eq(0).children().eq(i).children().eq(1).children().eq(0).children().eq(0).text().trim();
                    if (actor.name.length != 0) {
                        actor.character = "" + data.children().eq(0).children().eq(2).children().eq(5).children().eq(0).children().eq(i).children().eq(3).children().eq(0).children().eq(0).text().trim();
                        if (actor.character.length == 0) {
                            actor.character = " - ";
                        }
                        actor.link = "http://www.imdb.com" + data.children().eq(0).children().eq(2).children().eq(5).children().eq(0).children().eq(i).children().eq(1).children().eq(0).attr('href').trim();
                        actor.pic = "" + data.children().eq(0).children().eq(2).children().eq(5).children().eq(0).children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('loadlate');
                        if (actor.pic == "undefined") {
                            actor.pic = "http://ia.media-imdb.com/images/G/01/imdb/images/nopicture/32x44/name-2138558783._CB522736171_.png";
                        }
                        i++;
                        actors.push(actor);
                    } else {
                        break;
                    }
                }
                cast.actors = actors;
                json["Movie"] = cast;
            })

        }

        // render();
        fs.writeFile('cast.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the cast.json file');
            done = true;
            cast = require('../cast.json');
            render();
        });
    });
}

module.exports = router;


var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");
var input = process.argv
var command = input[3];

if (input.length === 2) {
    console.log("Command not found. Please enter in an accepted command. Choose from the following: \n\n movie-this\n spotify-this-song\n my-tweets\n do-what-it-says\n")
}

function loadTweets() {
    var creds = {
        screen_name: "MeganEv35823965",
    }
    var twitterUrl = "https://api.twitter.com/1.1/search?";
    client.get('statuses/user_timeline', creds, function (err, tweets, response) {
        if (!err) {
            for (var i = 0; i < 20; i++) {
                // console.log(tweets);
                if (tweets[i].text === undefined) {
                    console.log("nothing")
                } else {
                    console.log("Tweet:", tweets[i].text);
                    console.log("Created on:", tweets[i].created_at + "\n")
                }
            }
        }
    })
}

//twitter command code
if (input[2] === "my-tweets") {
    loadTweets();
}

//spotify command code
var songTitle = input[3];

// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
if (input[2] === "spotify-this-song") {
    console.log("spotify command");
    spotify.search({
        type: 'track',
        // songTitle
        query: "The Sign"
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.tracks.items[0]);
    })

}
//code to serach for OMDB movie
var movieTitle = input[3];
var queryUrl = "https://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

function requestMovie() {
    request(queryUrl, function (err, response, body) {

        if (!err && response.statusCode === 200) {
            console.log("Title:", JSON.parse(body).Title);
            console.log("Year Released:", JSON.parse(body).Year);
            console.log("IMDB Rating: ", JSON.parse(body).Ratings[0].Value);
            console.log("RT Rating: ", JSON.parse(body).Ratings[1].Value);
            console.log("Produced in:", JSON.parse(body).Country);
            console.log("Language:", JSON.parse(body).Language);
            console.log("Plot:", JSON.parse(body).Plot);
            console.log("Starring:", JSON.parse(body).Actors);
        } else {
            console.log(err);
        }
    })
}

//omdb command code
if (input[2] === "movie-this") {
    if (input.length === 3) {
        queryUrl = "https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
        requestMovie();
    } else if (input.length > 3) {
        requestMovie();
    }
}

//do-what-it-says code--will read random.txt and perform task
if (input[2] === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err)
        } else {
            var returnArr = data.split(",");
            var returnData = returnArr[1]
            if (returnArr[0] === "movie-this") {
                queryUrl = "https://www.omdbapi.com/?t=" + returnData + "&y=&plot=short&apikey=trilogy";
                requestMovie();

            } else if (returnArr[0] === "spotify-this-song") {


            } else if (returnArr[0] === "my-tweets") {
                loadTweets();
            } else {
                console.log("command not recognized")

            }
        }
    })

}
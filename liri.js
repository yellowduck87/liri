var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");

var input = process.argv

var json = [];

if (input.length === 2) {
    console.log("Command not found. Please enter in an accepted command. Choose from the following: \n\n movie-this\n spotify-this-song\n my-tweets\n do-what-it-says\n")
}

//code that get and loads tweets for Megan Evans---another screen name must be input if one would like to view another user's tweets.
function loadTweets() {
    var creds = {
        screen_name: "MeganEv35823965",
    }
    client.get('statuses/user_timeline', creds, function (err, tweets) {
        if (!err) {
            for (var i = 0; i < 20; i++) {
                console.log("Tweet:", tweets[i].text);
                fs.appendFile("log.txt", ("Tweets: "+tweets[i].text+"\n"), function (err){
                })
                console.log("Created on:", tweets[i].created_at + "\n")
                fs.appendFile("log.txt", ("Created on: "+ tweets[i].created_at + "\n"), function(err){
                })   
            }
        }
    })
}

//spotify command code
var songTitle = input[3];

function spotifyCommand() {
    spotify
        .search({
            type: 'track',
            query: songTitle,
            limit: 10
        })
        .then(function (response) {
            console.log("Artist(s):", response.tracks.items[0].artists[0].name);
            console.log("Title:", response.tracks.items[0].name);
            console.log("Preview link:", response.tracks.items[0].preview_url);
            console.log("Album:", response.tracks.items[0].album.name);

        })
        .catch(function (err) {
            console.log('Error occurred: ' + err);
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
//twitter command code
if (input[2] === "my-tweets") {
    loadTweets();
}

if (input[2] === "spotify-this-song") {
    if (input.length === 3) {
        spotify.search({
                type: 'track',
                query: "The Sign",
                limit: 10
            })
            .then(function (response) {
                console.log("Artist(s):", response.tracks.items[5].artists[0].name);
                console.log("Title:", response.tracks.items[5].name);
                console.log("Preview link:", response.tracks.items[5].preview_url);
                console.log("Album:", response.tracks.items[5].album.name);

            })
            .catch(function (err) {
                console.log('Error occurred: ' + err);
            })
    } else {
        spotifyCommand();
    }
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
            console.log(returnArr[0])
            if (returnArr[0] === "movie-this") {
                queryUrl = "https://www.omdbapi.com/?t=" + returnData + "&y=&plot=short&apikey=trilogy";
                requestMovie();
            } else if (returnArr[0] === "spotify-this-song") {
                songTitle = returnData;
                spotifyCommand();

            } else if (returnArr[0] === "my-tweets") {
                loadTweets();
            } else {
                console.log("command not recognized")
            }
        }
    })
}
fs.appendFile("log.txt", (input[2] + "," + "'" + input[3] + "'\n"), function (err) {
    if (err) {
        console.log(err)
    }
})
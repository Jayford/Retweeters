var async = require('async');
var Twit = require('twit');
var url = require('url');
var express = require('express');
var lastTenTweets;
var tweetsThatHaveRetweetsIDs = new Array();
var retweeterIDs = new Array();
var userInfo = new Array();
var result = "";
var returnData;
var userName;
var app = express();
var cors = require('cors');
app.use(cors());
var http = require('http');

const PORT=8080; 

app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

var T = new Twit({
    consumer_key:         '' // Your Consumer Key
  , consumer_secret:      '' // Your Consumer Secret
  , access_token:         '' // Your Access Token
  , access_token_secret:  '' // Your Access Token Secret
});


//A sample GET request    
app.get("/", function(req, res) {
    try
    {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    var queryObject = url.parse(req.url, true).query;
    
    console.log("THE QUERY VARIABLE IS " + queryObject.name);
    
    userName = queryObject.name;
    
    
    T.get('statuses/user_timeline', { screen_name: userName, count: 5 }, function(err, data, response) {
        
        lastTenTweets = data;
        console.log(data[1]);
    
    
async.waterfall([
    
    function(callback)
    {
        
        console.log('Function 1');

        
        for (var tweets in data){ 
        
        if(lastTenTweets[tweets].retweet_count > 0)
            {
            //console.log(data);
            tweetsThatHaveRetweetsIDs.push(lastTenTweets[tweets].id_str);
            console.log("Pushed ID " + lastTenTweets[tweets].id_str + " to array");
            }    
        }
        
        
        callback(null); 
    },
    
    function(callback) {
 
    console.log("Function 2");
    console.log(tweetsThatHaveRetweetsIDs);
   
    async.each(tweetsThatHaveRetweetsIDs, handleTweets, function(){
      callback(null);
    })
   
    //Async is going to pass each element from the array and a callback to our function.
    //Do the right stuff with it, then return the callback when it's complete.
    function handleTweets(individualTweet, cb_in){
    console.log("INDIVIDUAL TWEET =" + individualTweet);
    
      T.get('statuses/retweeters/ids', {
          id: individualTweet,
          stringify_ids: true
      }, function(err, data, response) {
          
          //console.log(data);
       
          for (var i = 0; i < data.ids.length; i++) {
              console.log("PUSHING USER ID " + data.ids[i]);
              retweeterIDs.push(data.ids[i]);
          }
         
        result = countArrayElements(retweeterIDs);
          var userIDs;
           
          T.get('users/lookup', {
              user_id: result[0].join(","),
              count: 10
          }, function(err, data, response) {
              //console.log(data);
              for (var i = 0; i < data.length; i++) {
                  var singleItem = data[i];
                  returnData = data;
                  returnData[i].JayApp = result[1][i];
                  console.log(data);
              }
              return cb_in();
          });
      });
     
     
    }
    }
], function ()
                {
    
    console.log("Function 3");
      res.end(JSON.stringify(returnData));
    reinitializeVariables();
                })

    });
}
    catch(e)
    {
       console.log(e);

    }
});
    



function countArrayElements(arr) {
    var a = [], b = [], prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    
    return [a, b];
}


function reinitializeVariables()
{

console.log("resting variables");

    
 tweetsThatHaveRetweetsIDs = new Array();
 retweeterIDs = new Array();
 userInfo = new Array();
 result = "";
 returnData;
 userName = "";
}
    


    

//handles twitter api authentication
function authenticate(val) {
  var TWITTER_CONSUMER_KEY = '';
  var TWITTER_CONSUMER_SECRET = '';
  
  // Encode consumer key and secret
  var tokenUrl = "https://api.twitter.com/oauth2/token";
  var tokenCredential = Utilities.base64EncodeWebSafe(
    TWITTER_CONSUMER_KEY + ":" + TWITTER_CONSUMER_SECRET);

  //  Obtain a bearer token with HTTP POST request
  var tokenOptions = {
    headers : {
      Authorization: "Basic " + tokenCredential,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "post",
    payload: "grant_type=client_credentials"
  };

  var responseToken = UrlFetchApp.fetch(tokenUrl, tokenOptions);
  var parsedToken = JSON.parse(responseToken);
  var token = parsedToken.access_token;
  var queryWord = "happy";

  // Authenticate Twitter API requests with the bearer token
  var apiUrl = "";
  if (val == 0) {
    apiUrl = "https://api.twitter.com/1.1/search/tweets.json?q=" + queryWord + "&count=100&lang=en&result_type=recent&tweet_mode=extended";
  } else {
    apiUrl = "https://api.twitter.com/1.1/search/tweets.json?q=feel&count=100&lang=en&result_type=recent&tweet_mode=extended";
  }
  var apiOptions = {
    headers : {
      Authorization: 'Bearer ' + token
    },
    "method" : "get"
  };

  return UrlFetchApp.fetch(apiUrl, apiOptions);
}

//returns current index of tweets in a sheet
function getCount(dataMap) {
  var count;
  if(dataMap.get('count') == undefined) {
    dataMap.set('count', 1);
    count = 1
  } else {
    count = parseInt(dataMap.get('count'));
  }
  return count;
}

//updates a spreadsheet storing 5000 most recent tweets
function live() {
  var tweet_cap = 100;
  var dataMap = new DataMap(1);
  count = getCount(dataMap);
  responseApi = authenticate(0)
  
  if (responseApi.getResponseCode() == 200) {
    // Parse the JSON encoded Twitter API response
    var tweets = JSON.parse(responseApi.getContentText()).statuses;
    var i = 0;
    var rt_count = 0;
    
    if (tweets) {
      for (i = 0; i < tweets.length; i++) {
        var tweet_text = clean_text(tweets[i].full_text);
        var profanity_check = profanity(tweet_text);
        
        if (!profanity_check) { //do not add tweet
          continue;
        }
        if (tweets[i].full_text.includes("RT @")) { //exclude retweets
            rt_count++;
        } else {
          
          var date = new Date(tweets[i].created_at);
          var end_str = date.toLocaleString() + " & " + tweets[i].user.location + " & " + tweet_text;
          var tweet_score = ((scores(tweet_text) / parseFloat(tweet_text.length)) * 100).toFixed(3);
          dataMap.setReplace(count + i - rt_count, end_str, tweet_score);
        }
      }
      
      i = i - rt_count;
      if (count + i > tweet_cap) { //reset once count reaches 100 
        dataMap.set('count', 1);
      } else {
        dataMap.set('count', count + i);
      }
    }
  }
}

function clean_text(text) {
  text = text.toLowerCase();
  text = text.replace(/\r?\n|\r/g, " "); //get rid of new lines
  text = text.replace(/&amp;/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); //handle &<>
  
  let split = text.split(" ");
  text = "";
  
  for (var i = 0; i < split.length; i++) { //remove mentions and links
    if (!split[i].includes("@") && !split[i].includes("http")) {
      if (i == split.length - 1) { //remove trailing whitespace
        text += split[i]; 
      } else {
        text += split[i] + " ";
      }
    }
  }
  return text;
}

function scores(text) {
  let lower = text.toLowerCase();
  let alphaOnly = lower.replace(/[.\\_,!?#]+/, ' ');
  let split = alphaOnly.split(" ");
  let counter = 0;
  
  for (var i = 0; i < split.length; i++) {
    counter += score_text(split[i]);
  }
  return counter;
}

//updates a spreadsheet storing ALL recent tweets
function main() {
  var dataMap = new DataMap(0);
  count = getCount(dataMap);  
  responseApi = authenticate(1)

  if (responseApi.getResponseCode() == 200) {
    // Parse the JSON encoded Twitter API response
    var tweets = JSON.parse(responseApi.getContentText()).statuses;
  
    if (tweets) {
      for (var i = 0; i < tweets.length; i++) { //iterate through response and add tweets to sheet
        var date = new Date(tweets[i].created_at);
        var temp = "[" + date.toUTCString() + "]" + tweets[i].text + " / ";
        dataMap.setNew(count + i, temp.toLowerCase(), count + i);
      }
    }
  }
}
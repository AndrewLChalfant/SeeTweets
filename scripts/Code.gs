//handles twitter api authentication
function authenticate() {
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

  // Authenticate Twitter API requests with the bearer token
  var apiUrl = "https://api.twitter.com/1.1/search/tweets.json?q=feel&count=100&lang=en&result_type=recent";
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
  var dataMap = new DataMap(1);
  count = getCount(dataMap);
  responseApi = authenticate()
  
  if (responseApi.getResponseCode() == 200) {
    // Parse the JSON encoded Twitter API response
    var tweets = JSON.parse(responseApi.getContentText()).statuses;
    var i = 0;
    
    if (tweets) {
      for (i = 0; i < tweets.length; i++) {
        var date = new Date(tweets[i].created_at);
        var temp = "[" + date.toUTCString() + "]" + tweets[i].text + " / ";
        dataMap.setReplace(count + i, temp.toLowerCase(), count + i);
      }
      
      if (count + i > 5000) { //reset once count reaches 5000 
        dataMap.set('count', 1);
      } else {
        dataMap.set('count', count + i);
      }
    }
  }
}

//updates a spreadsheet storing ALL recent tweets
function main() {
  var dataMap = new DataMap(0);
  count = getCount(dataMap);  
  responseApi = authenticate()

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
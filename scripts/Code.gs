function main() {
  var dataMap = new DataMap();

  var count;
  if(dataMap.get('count') == undefined) {
    dataMap.set('count', 1);
    count = 1
  } else {
    count = parseInt(dataMap.get('count'));
  }
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

  var responseApi = UrlFetchApp.fetch(apiUrl, apiOptions);

if (responseApi.getResponseCode() == 200) {
    // Parse the JSON encoded Twitter API response
    var tweets = JSON.parse(responseApi.getContentText()).statuses;
  
    if (tweets) {
      for (var i = 0; i < tweets.length; i++) {
        var date = new Date(tweets[i].created_at);
        var temp = "[" + date.toUTCString() + "]" + tweets[i].text + " / ";
        dataMap.set2(count + i, temp.toLowerCase());
      }
    }
  }
  //dataMap.set('count', count + i);
}
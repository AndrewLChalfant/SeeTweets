let resp;
let x = 0;
let h = 2000;
let w = 4000;

var twitter_oauth = {
  consumer_key: "OagIQuHT5iMiUL35EQ6slIbLI",
  consumer_secret: "6bSugZrMA86abapMZUF6jiFEtQAD8pnQkM6hM5d7H9Nh6cCken",
  token: "2712279546-0k61aaiudFUnmhwV55HfP1Aw1Iqfj2AIAp9cCo4",
  token_secret: "QEasKF1Z2ddh7rHMFPVwUswqVOMcwXthivs7RCAjSHVnk"
};

function setup() {
  createCanvas(w, h);
  let url = 'https://api.twitter.com/1.1/search/tweets.json?q=feel';
  httpDo (
    url, 
    {
      method: 'GET',
      headers : { authorization : twitter_oauth },
    },
    function(response) {
          resp = response;
    }
  );
}


function draw() {
  if (!resp) { //wait for api call to complete
    return;
  }
  
  print(resp);
  //let p = resp.features[0].properties.place;
  //let m = resp.features[0].properties.mag;
  
  fill(0);
  textSize(100);
  text(p, w/2, h/4);
  
  fill(m * 50, 0, 0);
  ellipse(w/2,h/2, m * 50, m * 50);
}

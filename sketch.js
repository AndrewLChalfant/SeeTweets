p5.disableFriendlyErrors = true;
let resp;
let resp2;

var x = 0;
let flip = true; 
let fade = 0;
let fade_rate = 10;
let fade_cap = 2300;
let timer = 0;
let timer2 = 0;
let dataMap;
let flip_switch = true;
var button;

let url = "https://sheets.googleapis.com/v4/spreadsheets/176z44O-mgCBX20skzYfsT7Kx1yibE4jguVcvXEHpn3M/values/";
let sheet_name = "live" + "!";
var r_max = 100; //how many datapoints to fetch
let range = "C2:C" + r_max;
let range2 = "B2:B" + r_max;
let key = "?key=AIzaSyC0A1JV1C3_JGvLh-3hKC3klIcNXCxUdYY";

let sheets_nums = url + sheet_name + range + key;
let sheets_words = url + sheet_name + range2 + key;
let index = 0;

let fontReglar;
let div;
let lastTweet = "";

//default backgrond color
let h = 25;
let s = 175;
let b = 225;
let c;

function preload() {
  //fontRegular =loadFont('Song.ttf');
}

function setup() {
  colorMode(HSB, 255);
  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight);
  setAttributes('antialias', true);
  update_call();
  //textFont(fontRegular);
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw(){
  c = color(h, s, b);
  background(c);

  if (millis() < 2000) {
    background(c);
    fill(0, 0, 255, 750 - millis()/3);
    textSize(80);
    text("SeeTweets", windowWidth/2 - 200, windowHeight/2 - 80, 600, 300);
    noStroke();
    rect(windowWidth/2 - 205, windowHeight/2, 420, 8);
    return;
  }

  draw_back_text();

  if (!resp || !resp2) {
    textSize(100);
    text(tweet, windowWidth/2 - 300, windowHeight/2 - 125, 600, 300);
    flip = true;
    return; //wait for http response
  }

  if (flip) {
    dataMap = convert(resp.values); 
    print("Converting");
    flip = false;
  }

  if (millis() >= 8000 + timer2 + Math.random()) { //update once per 8 secs 
    index += 1;
    fade = 0;
    flip_switch = true;
    timer2 = millis();
    if (index >= dataMap.length - 2) {
      index = 0;
    }
  }

  //print(fade);
  if (flip_switch && fade < fade_cap) {
    fade += 10;
  }
  if (fade >= fade_cap) {
    flip_switch = false;
  }

  if (!flip_switch && fade > -10) {
    fade -= fade_rate;
  }

  if (millis() >= 60000 + timer) {
    resp = null;
    update_call();
    timer = millis();
    return;
  }

  draw_text();
}

//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let arr = [];
  for (let i = 0; i < vals.length; i++) {
    var str = resp2.values[i][0];
    var score = vals[i][0];

    var location = str.split("&")[1];
    var tweet = str.split("&")[2]; //store username and if rt
    tweet = "\"" + tweet + "\"";

    arr.push([tweet, parseInt(score), location]);
  }

  print(arr);
  return arr;
}

function update_call() {
  httpGet(sheets_nums, 'jsonp', false, function(response) {
    resp = response;
  });
  httpGet(sheets_words, 'jsonp', false, function(response2) {
    resp2 = response2;
  });
}

function mousePressed() {
  if (mouseX > windowWidth/2 + 165 && mouseY > windowHeight/2 + 114) {
    if (mouseX < windowWidth/2 + 465 && mouseY < windowHeight/2 + 130) {
      let message = "I liked a tweet from SeeTweets.com: " + lastTweet; // %23SeeTweet";
      window.open('https://twitter.com/intent/tweet/?text=' + message + '&amp;url=" target="_blank"');
    }
  }
}

//draw supporting graphics
function draw_back_text() {
  textSize(20);
  fill(255);
  textFont('Helvetica');
  text("Displaying live tweets - anonymously from around the world", windowWidth/50, 20, 1000, 300);

  textSize(15);
  text("About", windowWidth/50, windowHeight - 25, 400, 200);

  fill(0, 0, 255, 0);
  stroke(0, 0, 255, 100);
  rect(windowWidth/2 - 320, windowHeight/2 - 200, 620, 300, 20);

  noStroke();
  fill(255);
  rect(windowWidth/2 + 150, windowHeight/2 + 110, 150, 20, 5);
  //textFont(fontRegular);

  textSize(10);
  fill(c);
  text("Share on Twitter", windowWidth/2 + 185, windowHeight/2 + 116, 600, 300);
}

//draw main tweet text
function draw_text() {
  if (dataMap[index]) {
    tweet = dataMap[index][0];
    lastTweet = tweet;
    
    if (tweet.length > 180) {
      textSize(22); 
    } else if (tweet.length > 130) {
      textSize(25);
      //fade_rate = 2;
    } else if (tweet.length < 30) {
      textSize(40);
    } else {
      textSize(33);
      //fade_rate = 2;
    }
    
    textAlign(CENTER);
    noStroke();
    fill(0, 0, 255, fade);
    text(tweet, windowWidth/2 - 300, windowHeight/2 - 125, 600, 300);
   
    textSize(15);
    textAlign(LEFT);

    var location = "unknown";
    if (dataMap[index][2] && dataMap[index][2] != "" && dataMap[index][2].length < 20) {
      location = dataMap[index][2];
      text("from: " + location, windowWidth/2 - 320, windowHeight/2 + 115, 600, 300);
    }

    stroke(255);
    fill(0, 0, 0, 0);
    //ellipse(windowWidth/2, windowHeight/2 - 85, dataMap[index][1] * 50, dataMap[index][1] * 50);
    strokeWeight(4);
    noStroke();
    //b += dataMap[index][1] / 500;
  }
}
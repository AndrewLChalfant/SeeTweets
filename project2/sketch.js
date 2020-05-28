p5.disableFriendlyErrors = true;
let resp;
var x = 0;
let flip = true; 
let timer = 0;
let dataMap;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/";
let sheet_name = "live_tweets" + "!";
var r_max = 5000; //how many datapoints to fetch
let range = "B2:B" + r_max;
let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + sheet_name + range + key;

let tex_white;
let tex_red;
let song;

let params = {
    scale: 15,
    scaleMin: 10,
    scaleMax: 20,
};
let dict = new Map();

function preload() {
}

function setup() { 
  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight);
  setAttributes('antialias', true);
  
  // define initial state
  var state = {
    distance : 200,
  };
  
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });

  gui = createGui();
  gui.addObject(params);
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw(){
  if (!resp) {
    return; //wait for http response
  }
  if (flip) {
    dataMap = convert(resp.values); 
    flip = false;
  }

  if (millis() >= 60000 + timer) { //update once per minute 
    background(random(255),random(255),random(255));
    httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
      });
    dataMap = convert(resp.values);
    timer = millis();
  }

  textSize(params.scale);
  background(0);
  text(dataMap[0], windowWidth/10, windowHeight/2 - 100);
  text(dataMap[2000], windowWidth/10, windowHeight/2);
  text(dataMap[3500], windowWidth/10, windowHeight/2 + 100);
  fill(255, 255, 255);
  noStroke();
}

//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let arr = [];
  for (let i = 0; i < vals.length; i++) {
    var str = vals[i][0];
    var tweet = str.split("]")[1]; //store username and if rt
    var temp = tweet.split(" ");
    temp.forEach(function(x) {
      if (dict.has(x)) {
        dict.set(x, dict.get(x) + 1);
      } else {
        dict.set(x, 1);
      }
    });
    //tweet = tweet.split(": ")[1];
    arr.push(tweet);
  }

  for (let [key, value] of dict) {
    if (value > 1000 && key.length > 2) {
      print(key + " and " + value);
    }
  }
  print(arr);
  return arr;
}

// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'a':
      visible = !visible;
      if(visible) gui.show(); else gui.hide();
      break;
  }
}
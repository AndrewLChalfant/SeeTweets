p5.disableFriendlyErrors = true;
let resp;
let resp2;

var x = 0;
let flip = true; 
let timer = 0;
let timer2 = 0;
let dataMap;
let button;

let url = "https://sheets.googleapis.com/v4/spreadsheets/176z44O-mgCBX20skzYfsT7Kx1yibE4jguVcvXEHpn3M/values/";
let sheet_name = "live" + "!";
var r_max = 100; //how many datapoints to fetch
let range = "C2:C" + r_max;
let key = "?key=AIzaSyC0A1JV1C3_JGvLh-3hKC3klIcNXCxUdYY";

let sheets_nums = url + sheet_name + range + key;
let sheets_words = url + sheet_name + "B2:B" + r_max + key;
let index = 0;
let h = 25;
let s = 175;
let b = 225;

function setup() {
  colorMode(HSB, 255);
  pixelDensity(1);
  var canvas = createCanvas(windowWidth, windowHeight);
  setAttributes('antialias', true);
  
  // define initial state
  var state = {
    distance : 200,
  };

  update_call();
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw(){
  let c = color(h, s, b);
  background(c);
  if (!resp || !resp2) {
    textSize(100);
    //text("Loading", windowWidth/10, windowHeight/2 - 100);
    flip = true;
    return; //wait for http response
  }

  if (flip) {
    dataMap = convert(resp.values); 
    print("Converting");
    flip = false;
  }

  if (millis() >= 8000 + timer2) { //update once per 30 secs
    index += 1;
    timer2 = millis();
    if (index == dataMap.length -1) {
      index = 0;
    }
  }
    if (millis() >= 60000 + timer) {
      resp = null;
      update_call();
      timer = millis();
      return;
  }
  
  textSize(10);
  fill(255);
  text("Displaying happy live tweets", windowWidth/50, 20, 400, 200);
  text("Andrew Chalfant 2020", windowWidth/50, windowHeight - 25, 400, 200);
  
  textSize(20);
  if (dataMap) {
    fill(255);
    text(dataMap[index][0], windowWidth/2 - 200, windowHeight/2 - 100, 400, 200);
    stroke(255);
    fill(0, 0, 0, 0);
    //ellipse(windowWidth/2, windowHeight/2 - 85, dataMap[index][1] * 50, dataMap[index][1] * 50);
    strokeWeight(4);
    noStroke();
    //b += dataMap[index][1] / 500;
  }
}

//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let arr = [];
  for (let i = 0; i < vals.length; i++) {
    var str = resp2.values[i][0];
    var score = vals[i][0];
    var tweet = str.split("]")[1]; //store username and if rt
    tweet = tweet.replace("&amp;", "and");
    //var temp = tweet.split(" ");
    //tweet = tweet.split(": ")[1];
    if (parseInt(score) > 3 && !tweet.includes("birthday") && !tweet.includes("bday")) {
      arr.push([tweet, parseInt(score)]);
    }
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
p5.disableFriendlyErrors = true;
let resp;
let resp2;

var x = 0;
let flip = true; 
let fade = 0;
let fade_rate = 5;
let fade_cap = 1050;
let timer = 0;
let timer2 = 0;
let dataMap;
let flip_switch = true;

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

//default backgrond color
let h = 25;
let s = 175;
let b = 225;
function preload() {
  fontRegular =loadFont('Song.ttf');
}

function setup() {
  colorMode(HSB, 255);
  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight);
  setAttributes('antialias', true);
  update_call();
  textFont(fontRegular);
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

  if (millis() >= 8000 + timer2 ) { //update once per 8 secs + Math.random()
    index += 1;
    fade = 0;
    flip_switch = true;
    timer2 = millis();
    if (index >= dataMap.length - 2) {
      index = 0;
    }
  }

  print(fade);
  if (flip_switch && fade < fade_cap) {
    fade += 5;
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
    var tweet = str.split("]")[1]; //store username and if rt
    var location = str.split("]")[0];
    tweet = tweet.replace(/&amp;/g, "");
    tweet = "\"" + tweet.replace(/&lt;/g, "<") + "\"";

    if (parseInt(score) > 2 && !tweet.includes("birthday") && !tweet.includes("bday")) {
      arr.push([tweet, parseInt(score), location]);
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

function draw_text() {
  textSize(10);
  fill(255);

  textFont('Helvetica');
  text("Displaying happy live tweets - anonymously from around the world", windowWidth/50, 20, 400, 300);
  text("Andrew Chalfant 2020", windowWidth/50, windowHeight - 25, 400, 200);
  //textFont(fontRegular);

  if (dataMap[index]) {
    tweet = dataMap[index][0];
    if (tweet.length > 150) {
      textSize(25);
      //fade_rate = 2;
    } else {
      textSize(35);
      //fade_rate = 2;
    }
    
    stroke(0, 0, 255, 100);
    textAlign(CENTER);
    fill(0, 0, 255, 0);
    rect(windowWidth/2 - 320, windowHeight/2 - 200, 620, 300, 20);
    
    noStroke();
    fill(0, 0, 255, fade);
    text(dataMap[index][0], windowWidth/2 - 300, windowHeight/2 - 125, 600, 300);
    textSize(15);

    var location = "unknown";
    if (dataMap[index][2]) {
      location = dataMap[index][2];
    }

    textAlign(LEFT);
    //fill(0, 0, 255, 255);
    text("from: " + location, windowWidth/2 - 320, windowHeight/2 + 115, 600, 300);

    stroke(255);
    fill(0, 0, 0, 0);
    //ellipse(windowWidth/2, windowHeight/2 - 85, dataMap[index][1] * 50, dataMap[index][1] * 50);
    strokeWeight(4);
    noStroke();
    //b += dataMap[index][1] / 500;
  }
}
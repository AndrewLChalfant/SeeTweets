//SOURCE CODE HERE: https://github.com/AndrewLChalfant/SeeTweets

p5.disableFriendlyErrors = true;
let resp;
let resp2;
let page = 0;

let flip = true; 
let fade = 0;
let fade_rate = 10;
let fade_cap = 2300;
let timer = 0;
let timer2 = 0;

let dataMap;
let flip_switch = true;
let about_switch = false;

var click;
var email;

let url = "https://sheets.googleapis.com/v4/spreadsheets/176z44O-mgCBX20skzYfsT7Kx1yibE4jguVcvXEHpn3M/values/";
let sheet_name = "live" + "!";
var r_max = 100; //how many datapoints to fetch
let range = "C2:C" + r_max;
let range2 = "B2:B" + r_max;
let key = "?key=AIzaSyC0A1JV1C3_JGvLh-3hKC3klIcNXCxUdYY";

let sheets_nums = url + sheet_name + range + key;
let sheets_words = url + sheet_name + range2 + key;
let index = 0;

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
  textStyle(BOLD);
  colorMode(HSB, 255);
  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight);
  setAttributes('antialias', true);
  update_call();
  //textFont(fontRegular);
  index = int(Math.random() * 30);
  name_input = createInput('');
  text_input = createElement("textarea", "");
  button = createButton('Send');

  aboutX = windowWidth - 200;
  contactX = windowWidth - 100;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw(){
  c = color(h, s, b);
  background(c);

  //loading screen
  if (millis() < 2000) {
    background(c);
    fill(0, 0, 255, 750 - millis()/3);
    textSize(80);
    text("SeeTweets", windowWidth/2 - 200, windowHeight/2 - 80, 600, 300);
    noStroke();
    rect(windowWidth/2 - 205, windowHeight/2, 420, 8);
    return;
  }

  /*if (page == 0 && (!resp || !resp2)) {
    textSize(100);
    text(lastTweet, windowWidth/2 - 300, windowHeight/2 - 125, 600, 300);
    flip = true;
    return; //wait for http response
  }*/

  if (flip) {
    dataMap = convert(resp.values); 
    print("Converting");
    flip = false;
  }

  if (millis() >= 8000 + timer2 + Math.random() || click) { //update once per 8 secs 
    index += 1;
    fade = 0;
    flip_switch = true;
    timer2 = millis();
    if (index >= dataMap.length - 2) {
      index = 0;
    }
    click = false;
  }

  if (flip_switch && fade < fade_cap) {
    fade += 10;
  }
  if (fade >= fade_cap) {
    flip_switch = false;
  }

  if (!flip_switch && fade > -10) {
    fade -= fade_rate;
  }

  if (millis() >= 30000 + timer) {
    resp = null;
    update_call();
    timer = millis();
    return;
  }

  if (page == 1) {
    draw_about();
  } else if (page == 2) {
    draw_contact();
  } else if (page == 0) {
    if (button) {
      text_input.hide()
      button.hide();
      name_input.hide();
    }
    draw_text();
  }
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
  if (clickHelper(aboutX, aboutX + 60, 20, 50)) {
    page = 1; //visit about page
  }

  if (clickHelper(contactX, contactX + 60, 20, 50)) {
    page = 2; //visit contact page
  }

  if (page == 0) { //home page
    if (clickHelper(windowWidth/2 + 145, windowWidth/2 + 465, windowHeight/2 + 114, windowHeight/2 + 130)) { //share tweet
        let message = "I liked a tweet from SeeTweets.com: " + lastTweet; // %23SeeTweet";
        window.open('https://twitter.com/intent/tweet/?text=' + message + '&amp;url=" target="_blank"');
    }

    if (clickHelper(windowWidth/2 - 300, windowWidth/2 + 300, windowHeight/2 - 120, windowHeight/2 + 110)) {
        click = true; //skip tweet
    }

  } else if (page == 1) { //about page
    if (clickHelper(windowWidth/2 + 250, windowWidth/2 + 300, windowHeight/2 - 290, windowHeight/2 - 220)) {
      page = 0; 
    }

    if (clickHelper(windowWidth/2 - 100, windowWidth/2 + 100, windowHeight/2 + 100, windowHeight/2 + 200)) {
      window.open("https://github.com/AndrewLChalfant/SeeTweets");
    }

  } else if (page == 2) { //contact page
    if (clickHelper(windowWidth/2 + 250, windowWidth/2 + 300, windowHeight/2 - 290, windowHeight/2 - 220)) {
      page = 0; 
    }

  }
}

function clickHelper(x1, x2, y1, y2) {
  if (mouseX > x1  && mouseY > y1) { //share tweet
    if (mouseX < x2 && mouseY < y2) {
      return true;
    }
  }
  return false;
}

function send_contact() {
  if (text_input.value().trim() === "" || name_input.value().trim() === "") {
    drawError = true;
    contactMessage = "Error: Invalid input";
  } else { 
    Email.send({
    SecureToken : "8f3f3aff-06d2-493b-aa98-1d135b73a48b",
    To : "achalfan@terpmail.umd.edu", 
    From : "noreply@seetweets.com",
    Subject : "SeeTweets User Input from " + name_input.value(),
    Body : text_input.value()
    }).then(
          message => feedback_sent()
      );
    }
}

function feedback_sent(){
  drawError = true;
  contactMessage = "Message sent successfully";
}
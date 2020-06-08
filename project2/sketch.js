p5.disableFriendlyErrors = true;
let resp;
var x = 0;
let flip = true; 
let timer = 0;
let dataMap;

let url = "https://sheets.googleapis.com/v4/spreadsheets/176z44O-mgCBX20skzYfsT7Kx1yibE4jguVcvXEHpn3M/values/";
let sheet_name = "live" + "!";
var r_max = 5000; //how many datapoints to fetch
let range = "C2:C" + r_max;
let key = "?key=AIzaSyC0A1JV1C3_JGvLh-3hKC3klIcNXCxUdYY";
let sheets = url + sheet_name + range + key;


let song;
let plot;

let params = {
    scale: 5.0,
    scaleMin: 0,
    scaleMax: 10.0,
};
let dict = new Map();

function preload() {
}

function setup() { 
  pixelDensity(1);
  var canvas = createCanvas(windowWidth, windowHeight);
  plot = new GPlot(this);

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
  background(50);
  if (!resp) {
    textSize(100);
    text("Loading", windowWidth/10, windowHeight/2 - 100);
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
  
  stroke(255, 128, 128);
  for (let  i=0; i < dataMap.length; i++) {
    if (dataMap[i] > 0) {
      stroke(128, 128, 255);
    } else {
      stroke(255, 128, 128);
    }
    ellipse(windowWidth/20 + i/5 * windowWidth/800, windowHeight/2 + 8 * dataMap[i], 1 + params.scale/5.0);
  }
  //textSize(params.scale);
  //text(dataMap[0], windowWidth/10, windowHeight/2 - 100);
  //text(dataMap[2000], windowWidth/10, windowHeight/2);
  //text(dataMap[3500], windowWidth/10, windowHeight/2 + 100);
  fill(255, 255, 255);
}

//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let arr = [];
  for (let i = 0; i < vals.length; i++) {
    var str = vals[i][0];
    //var tweet = str.split("]")[1]; //store username and if rt
    //var temp = tweet.split(" ");
    //tweet = tweet.split(": ")[1];
    if (str != 0) {
      arr.push(str)
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


function draw_plot(p) {
    // Clean the canvas
    p.background(150);

    // Draw the plot
    plot.beginDraw();
    plot.drawBackground();
    plot.drawBox();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawTopAxis();
    plot.drawRightAxis();
    plot.drawTitle();
    plot.drawPoints();
    plot.endDraw();
  };
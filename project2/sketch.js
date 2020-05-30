p5.disableFriendlyErrors = true;
let resp;
var x = 0;
let flip = true; 
let timer = 0;
let dataMap;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/";
let sheet_name = "live_tweets" + "!";
var r_max = 5000; //how many datapoints to fetch
let range = "C2:C" + r_max;
let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + sheet_name + range + key;


let song;
let plot;

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
  background(0);
  if (!resp) {
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

    plot.setPos(0, 0);
    plot.setOuterDim(500, 500);

    // Add the points
    plot.setPoints(dataMap);

    // Set the plot title and the axis labels
    plot.setTitleText("A very simple example");
    plot.getXAxis().setAxisLabelText("x axis");
    plot.getYAxis().setAxisLabelText("y axis"); 
    //plot.setLogScale("y");
    plot.activatePanning();
    // Draw it!
    draw_plot(this);
    plot.setPointColor(this.color(50, 50, 255, 20));
  //textSize(params.scale);
  //text(dataMap[0], windowWidth/10, windowHeight/2 - 100);
  //text(dataMap[2000], windowWidth/10, windowHeight/2);
  //text(dataMap[3500], windowWidth/10, windowHeight/2 + 100);
  fill(255, 255, 255);
  noStroke();
}

//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let arr = [];
  for (let i = 0; i < vals.length; i++) {
    var str = vals[i][0];
    //var tweet = str.split("]")[1]; //store username and if rt
    //var temp = tweet.split(" ");
    //tweet = tweet.split(": ")[1];
    arr[i]= new GPoint(i, str);
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
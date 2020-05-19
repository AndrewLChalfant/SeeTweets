/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018-2019 by p5.EasyCam authors
 *
 *   Source: https://github.com/freshfork/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 * 
 */
 
let resp;
var x = 0;
let flip = true; 
let dataMap;
let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet4!";
var r_max = 100; //how many datapoints to fetch
let range = "A2:C13";// + r_max;
let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + range + key;
var easycam;
let params = {
    radius: 200,
    radiusMin: 50,
    radiusMax: 2000
};

function preload() {
  twitter = loadImage("../twitter__.png");}
    var arr = [0.319,
    0.314,
    0.31,
    0.34,
    0.315,
    0.312,
    0.306,
    0.304,
    0.31,
    0.282,
    0.297,
    0.306,];
function setup() { 
  pixelDensity(1);
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
    x = random(width);
  y = random(height);
  
  // define initial state
  var state = {
    distance : 200,
    // rotation : Dw.Rotation.create({angles_xyz:[0, 0, 0]}),
  };
  
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });
  //easycam = new Dw.EasyCam(this._renderer, state);
  
  // slower transitions look nicer in the ortho mode
//  easycam.setDefaultInterpolationTime(2000); //slower transition
  // start with an animated rotation
 // easycam.setRotation(Dw.Rotation.create({angles_xyz:[PI/2, PI/2, PI/2]}), 2500);
 // easycam.setDistance(400, 2500);
 // gui = createGui();
  //gui.addObject(params);
} 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}
function draw(){
  
  //if (!resp) {
  // return; //wait for http response
  //}
  //if (flip) {
  // dataMap = convert(resp.values); 
  //  flip = false;
  //}
//  var cam_dist = easycam.getDistance();
  //var oscale = cam_dist * 0.001;
//  var ox = width  / 2 * oscale;
  //var oy = height / 2 * oscale;
 // ortho(-ox, +ox, -oy, +oy, -10000, 10000);
  //easycam.setPanScale(0.004 / sqrt(cam_dist));
  
  background(255);
  noStroke();
  
  ambientLight(200);
 pointLight(255, 255, 255, 0, 0, 0);
  
  // objects
  noStroke();
  randomSeed(2);
  noStroke();
  randomSeed(63);
  background(255);
  for(var i = 0; i < 50; i++){
    var m = 250;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);
    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r/2;
    var b = ((tz / m) * 0.5 + 0.5) * g*6;
    push();
    translate(tx, ty, tz-250);
    ambientMaterial(r,g,b);
    //iterate over every day and scale sphere based on positivity data
    for (var x in arr) {
      var positive = arr[x];
      sphere(random(positive - 0.3) * params.radius);
    }
    pop();
  }
  camera()
  smooth(6400);
  ambientLight(10000);
 //rotate(300);
 image(twitter, x-450, y-1050);
}
//get tweets from google sheet and return dict of relevant strings
function convert(vals){
  let dict = {};
  for (let i = 0; i < vals.length; i++) {
    var datapoint = vals[i][0];
    var positive = vals[i][1];
    var negative = vals[i][2];
    dict[datapoint] = positive;
  }
  print(dict);
  return dict;
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
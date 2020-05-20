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
p5.disableFriendlyErrors = true;
let resp;
var x = 0;
let flip = true; 
let dataMap;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet4!";
var r_max = 100; //how many datapoints to fetch
let range = "A2:C13";// + r_max;
let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + range + key;
let tex;
var easycam;

let params = {
    scale: 1,
    scaleMin: 0,
    scaleMax: 10,
    seed: 0,
    seedMin: 0,
    seedMax: 100,
};

function preload() {
    tex = loadImage('GreenTexture.jpg') 
}

function setup() { 
  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  // define initial state
  var state = {
    distance : 200,
    // rotation : Dw.Rotation.create({angles_xyz:[0, 0, 0]}),
  };
  
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });

  easycam = new Dw.EasyCam(this._renderer, state);
  
  // slower transitions look nicer in the ortho mode
  easycam.setDefaultInterpolationTime(2000); //slower transition
  // start with an animated rotation
  easycam.setRotation(Dw.Rotation.create({angles_xyz:[PI/2, PI/2, PI/2]}), 2500);
  easycam.setDistance(400, 2500);

  gui = createGui();
  gui.addObject(params);
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw(){
  
  if (!resp) {
    return; //wait for http response
  }
  if (flip) {
    dataMap = convert(resp.values); 
    flip = false;
  }

  var cam_dist = easycam.getDistance();
  var oscale = cam_dist * 0.001;
  var ox = width  / 2 * oscale;
  var oy = height / 2 * oscale;
  ortho(-ox, +ox, -oy, +oy, -10000, 10000);
  easycam.setPanScale(0.004 / sqrt(cam_dist));
  
	background(255);
  noStroke();

  ambientLight(200);
  pointLight(255, 255, 255, 0, 0, 0);

  // objects
  noStroke();
  randomSeed(2);
  noStroke();
  randomSeed(params.seed);
  background(0);

  for(var i = 0; i < 60; i++){

    //iterate over every day and scale sphere based on positivity data
    for (var key in dataMap) {
      var m = 100;
      var tx = random(-m, m);
      var ty = random(-m, m);
      var tz = random(-m, m);

      translate(tx, ty, tz);
      var r = 50;
      var g = 20;
      var b = 20;
      var positive = Number(dataMap[key]);
      var scale = Math.pow(1.0 / positive, 7) / 20;
      if (positive > 0.29) {
        r = random(0, 5) + scale;
      } else {
        r = random(0, 5) + scale;
        g = random(0, 5) + scale;
        b = random(0, 5) + scale;
      }
      texture(tex);
      //ambientMaterial(r,g,b);
      sphere(random(0, 5) + Math.pow(scale/100,2) * params.scale);
    }
  }
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

function canvasPressed(){
  //mySound.play();
}
let resp;
let x = 0;
let h = 1000;
let w = 1000;
let text;
let flip = true; 
let dataMap;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet4!";
let r_max = 100; //how many datapoints to fetch
let range = "A2:C13";// + r_max;
let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + range + key;
let emotion = [0, 0, 0, 0];

function setup() { 
  pixelDensity(1);
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  var state = {
    distance : 200
  };
  tex = createGraphics(windowWidth, windowHeight);
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//begin actually drawing
function draw(){
  if (!resp) {
    return; //wait for http response
  }
  //convert json response to dict a single time time
  if (flip) {
    dataMap = convert(resp.values); 
    flip = false;
   }
  camera(30, 60, -20 + sin(frameCount * 0.003) * 400, 90, 180, -60, frameCount, 1, -frameCount);
  plane(200, 200);
  background(125);
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 0);
  noStroke();
  randomSeed(69);
  
  for(var i = 0; i < 40; i++){
    var m = 250;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);
    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r/4;
    var b = ((tz / m) * 0.5 + 0.5) * g*6;
    push();
    translate(tx, ty, tz);
    ambientMaterial(r,g,b);

    //iterate over every day and scale sphere based on positivity data
    for (var key in dataMap) {
      var positive = dataMap[key]
      sphere(random(positive - 0.3) * 200);
    }
    pop();
  }
}

//plane(window.innerWidth - 4, window.innerHeight - 4);
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

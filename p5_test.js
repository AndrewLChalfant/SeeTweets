let resp;
let x = 0;
let h = 1000;
let w = 1000;
let text;
let flip = true; 
let z;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet1!";
let r_max = 10; //HOW MANY TWEETS TO FETCH, 5000 seems to be the max
let range = "B2:B" + r_max;
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
  
  text = createGraphics(window.innerWidth - 4, window.innerHeight - 4);
  text.fill(100);
  text.textSize(50);
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
    z = convert(resp.values); 
    for (let i = 0; i < z.length; i++) {
      emotion[0] += analysis(z[i])[0];
      emotion[1] += analysis(z[i])[1];
      emotion[2] += analysis(z[i])[2];
      emotion[3] += analysis(z[i])[3];
    }
    flip = false;
    print(emotion); //cumulative emotional scores from tweets
    
    let sad_perc = (100 * (emotion[0] / r_max)).toFixed(2) + "% sad tweets. ";
    let happy_perc = (100 * (emotion[1] / r_max)).toFixed(2) + "% happy tweets. ";
    let mad_perc = (100 * (emotion[2] / r_max)).toFixed(2) + "% mad tweets. ";
    let love_perc = (100 * (emotion[3] / r_max)).toFixed(2) + "% love tweets. ";
    text.text(sad_perc + happy_perc + mad_perc + love_perc + "Sample size " + r_max, 
    width * 0.5, height * 0.3);
  }
  
  camera(30, 60, -20 + sin(frameCount * 0.003) * 400, 90, 180, -60, frameCount, 1, -frameCount);
  plane(200, 200);
  background(125);
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 0);
  noStroke();
  randomSeed(69);
  
  for(var i = 0; i < 100; i++){
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
    sphere(random(10,30));
    pop();
  }

}

//plane(window.innerWidth - 4, window.innerHeight - 4);
//get tweets from google sheet and return dict of relevant strings
function convert(z){
  let arr = [];
  for (let i = 0; i < z.length; i++) {
    var str = z[i][0];
    var tweet = str.split("]")[1];
    arr.push(tweet);
  }
  print(arr);
  return arr;
}

//takes string and returns array of 4 floats scoring emotions
function analysis(s) {
  let arr = [0, 0, 0, 0];
  if (s.includes("sad" || "cry" || "lone" || "upset")) {
    arr[0] = 1; }
  if (s.includes("happy" || "yay" || "joy" || "laugh")) {
    arr[1] = 1; }
  if (s.includes("mad" || "angry" || "pissed" || "anger")) {
    arr[2] = 1;}
  if (s.includes("love" || "loving" || "heart" || "trust")) {
    arr[3] = 1;}
  return arr;
}

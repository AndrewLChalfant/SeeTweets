let resp;
let x = 0;
let h = 2000;
let w = 4000;

let c = 60;
let a = 25;
let r = 100;
let angle = 30;
let tex;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet1!";
let range = "B2:B20";
let key = "?key=###";
let sheets = url + range + key;
let flip = true; 
let z;
let emotion = [0, 0, 0, 0];

function setup() 
{
  createCanvas(w, h, WEBGL);
  tex = createGraphics(800, 800);
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });
}

function draw() 
{
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
  }
  
  //begin actually drawing
  background(0);
  push();
  
  //translate(200*100, 200)
  let x = r + c * cos(a);
  let y = r + c * sin(a);

  tex.fill(frameCount, 12, random(c));
  tex.ellipse(x * 15, y + 300, 20, 30);

  c += 0.6;
  a += 0.1;
  pop();

  push();
  texture(tex);
  rotateX(angle);
  rotateY(angle);
  rotateZ(angle);
  sphere(222);

  angle += 0.0010*10;
  pop();
}

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
  if (s.includes("sad" || "cry" || "lone")) {
    arr[0] = 1; }
  if (s.includes("happy" || "yay" || "glad")) {
    arr[1] = 1; }
  if (s.includes("mad" || "angry" || "upset")) {
    arr[2] = 1;}
  if (s.includes("love" || "loving" || "heart")) {
    arr[3] = 1;}
  return arr;
}

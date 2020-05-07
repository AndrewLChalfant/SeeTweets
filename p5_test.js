let resp;
let x = 0;
let h = 2000;
let w = 4000;

let c = 60;
let a = 25;
let r = 100;
let angle = 30;
let tex;

let text;
let flip = true; 
let z;

let url = "https://sheets.googleapis.com/v4/spreadsheets/1tjvDbvUsSogN2CK5RrXXntTHlWSRl-1T4UiUJJLw5gA/values/Sheet1!";
let r_max = 5000; //HOW MANY TWEETS TO FETCH, 5000 seems to be the max
let range = "B2:B" + r_max;

let key = "?key=AIzaSyCEQ1fTLIunpWw7aMdFXgfyQ6lvkN4kiZc";
let sheets = url + range + key;
let emotion = [0, 0, 0, 0];

function setup() 
{
  createCanvas(w, h, WEBGL);
  tex = createGraphics(400, 400);
  httpGet(sheets, 'jsonp', false, function(response) {
    resp = response;
  });
  text = createGraphics(window.innerWidth - 4, window.innerHeight - 4);
  text.fill(100);
  text.textSize(50);
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
    let sad_perc = (100 * (emotion[0] / r_max)).toFixed(2) + "% sad tweets. ";
    let happy_perc = (100 * (emotion[1] / r_max)).toFixed(2) + "% happy tweets. ";
    let mad_perc = (100 * (emotion[2] / r_max)).toFixed(2) + "% mad tweets. ";
    let love_perc = (100 * (emotion[3] / r_max)).toFixed(2) + "% love tweets. ";
    text.text(sad_perc + happy_perc + mad_perc + love_perc + "Sample size " + r_max, 
    width * 0.5, height * 0.3);
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
  texture(text);
  plane(window.innerWidth - 4, window.innerHeight - 4);
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

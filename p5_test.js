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
let range = "B2:B10";
let key = "?key=###";
let sheets = url + range + key;
let flip = true; 
let z;

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
    return;
  }
  if (flip) {
    z = convert(resp.values);
    flip = false;
  }
  
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

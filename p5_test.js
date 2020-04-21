let resp;
let x = 0;
let h = 2000;
let w = 4000;

function setup() {
  createCanvas(w, h);
  let url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?' +
    'format=geojson&limit=1&orderby=time';
  httpGet(url, 'jsonp', false, function(response) {
    resp = response;
  });
}


function draw() {
  if (!resp) { //wait for api call to complete
    return;
  }
  
  let p = resp.features[0].properties.place;
  let m = resp.features[0].properties.mag;
  
  fill(0);
  textSize(100);
  text(p, w/2, h/4);
  
  fill(m * 50, 0, 0);
  ellipse(w/2,h/2, m * 50, m * 50);
}

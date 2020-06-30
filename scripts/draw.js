let text_input;
let name_input;
let button;

let heightbox = 0;
let heightSpeed = 8;
let errorFill = 0;
let drawError = false;
let contactMessage = "";

let aboutX;
let contactX;

//draw supporting graphics for main page
function draw_back_text() {
  if (heightbox > 0) {
    heightbox -= heightSpeed;
  }

  drawHeader();
  fill(0, 0, 255, 0);
  stroke(0, 0, 255, 100);
  rect(windowWidth/2 - 310, windowHeight/2 - 200 - heightbox/2, 620, 300 + heightbox, 20);

  noStroke();
  fill(255);
  rect(windowWidth/2 + 150, windowHeight/2 + 110, 150, 20, 5);
  //textFont(fontRegular);

  textSize(11);
  fill(c);
  if (windowWidth > 600) {
    text("Share on Twitter", windowWidth/2 + 175, windowHeight/2 + 116, 600, 300);
  } else {
      text("Share on Twitter", windowWidth/2 + 150, windowHeight/2 + 116, 600, 300);
  }
}

//draw main tweet text
function draw_text() {
  draw_back_text();

  if (dataMap[index]) {
    tweet = dataMap[index][0];
    lastTweet = tweet;

    if (tweet.length > 180) {
      textSize(22); 
    } else if (tweet.length > 130) {
      textSize(25);
      //fade_rate = 2;
    } else if (tweet.length < 30) {
      textSize(40);
    } else {
      textSize(33);
      //fade_rate = 2;
    }
    
    textAlign(CENTER);
    noStroke();
    fill(0, 0, 255, fade);
    text(tweet, windowWidth/2 - 300, windowHeight/2 - 125, 600, 300);
   
    textSize(15);
    textAlign(LEFT);

    var location = "unknown";
    if (dataMap[index][2] && dataMap[index][2] != "" && dataMap[index][2].length < 20) {
      location = dataMap[index][2];
      textStyle(NORMAL);
      text("from: " + location, windowWidth/2 - 310, windowHeight/2 + 115, 600, 300);
      textStyle(BOLD);
    }

    stroke(255);
    fill(0, 0, 0, 0);
    //ellipse(windowWidth/2, windowHeight/2 - 85, dataMap[index][1] * 50, dataMap[index][1] * 50);
    strokeWeight(4);
    noStroke();
    //b += dataMap[index][1] / 500;
  }
}

//draw the about page
function draw_about() {
  if (button) {
    text_input.hide();
    name_input.hide();
    button.hide();
  }

  if (heightbox < 200) {
    heightbox += heightSpeed;
  }

  c = color(h, s, b);
  background(c);
  drawHeader();

  fill(0, 0, 255, 0);
  stroke(0, 0, 255, 100);
  rect(windowWidth/2 - 310, windowHeight/2 - 200 - heightbox/2, 620, 300 + heightbox, 20);
  //rect(windowWidth/2 - 310, windowHeight/2 - 300, 620, 600, 20);

  fill(0, 0, 255, 0 + (1.2 * heightbox));
  noStroke();
  textSize(50);
  text("About", windowWidth/2 - 70, windowHeight/2 - 250, 600, 300);

  textStyle(NORMAL);
  text("x", windowWidth/2 + 250, windowHeight/2 - 290, 600, 300);

  textSize(20);
  let temp_text = "Everyday we are bombarded with negative content posted across the internet. " + 
                  "Unfortunately this abundance of negativity often drowns out more uplifting messages. \n\n" + 
                  "The purpose of SeeTweets is simple: to highlight positive content. " +
                  "SeeTweets anonymously displays live tweets from around the world in real time. \n\n" + 
                  "SeeTweet is an open source project built by Andrew Chalfant with p5.js and Google Scripts. To learn more click here.";
  text(temp_text, windowWidth/2 - 230, windowHeight/2 - 180, 500, 500);
  textStyle(BOLD);
  //text("here.", windowWidth/2 - 70, windowHeight/2 + 95, 500, 500);
}


//draw the contact page
function draw_contact() {
  //text after button press
  if (drawError) {
    fill(0, 0, 255, errorFill);
    text(contactMessage, text_input.x, button.y + button.height + 10, 500, 500);
  }

  if (errorFill >= 0) {
    errorFill -= 4;
  } else {
    drawError = false;
    errorFill = 1000;
  }

  if (heightbox < 200) {
    heightbox += heightSpeed;
  }

  if (button) {
    name_input.show();
    text_input.show();
    button.show();
  }

  fill(255);
  c = color(h, s, b);
  //background(c);
  drawHeader();

  fill(0, 0, 255, 0);
  stroke(0, 0, 255, 100);
  rect(windowWidth/2 - 310, windowHeight/2 - 200 - heightbox/2, 620, 300 + heightbox, 20);

  fill(0, 0, 255, 0 + (1.2 * heightbox));
  noStroke();
  textSize(50);
  text("Contact", windowWidth/2 - 90, windowHeight/2 - 250, 600, 300);
  textStyle(NORMAL);
  text("x", windowWidth/2 + 250, windowHeight/2 - 290, 600, 300);
  
  textSize(20);
  name_input.position(windowWidth/2 - 150, windowHeight/2 - 150);
  name_input.size(310, 30);
  name_input.style("border", "none");
  text("Name:", name_input.x, name_input.y - 20, 600, 300);

  text_input.position(windowWidth/2 - 150, windowHeight/2 - 80);
  text_input.size(name_input.width, name_input.height * 4);
  text_input.style("border", "none");
  text("Message:", text_input.x, text_input.y - 20, 600, 300);

  //style send button
  button.position(text_input.x, text_input.y + text_input.height + 20);
  button.size(text_input.width, text_input.height * 0.5);

  button.style('background-color', c);
  button.style('color', "white");
  button.style('font-size', 20);
  button.style('border', '2px solid white');
  button.style('opacity', 0.9);
  button.style("border-radius", "6px");

  button.mousePressed(send_contact); 
  textStyle(BOLD);
}

//draw default header
function drawHeader() {
  textSize(20);
  fill(255);
  textFont('Helvetica');
  text("Displaying live tweets - anonymously from around the world", windowWidth/50, 20, 1000, 300);

  textStyle(NORMAL);
  textSize(20);
  text("About", aboutX, 20, 400, 200);
  text("Contact", contactX, 20, 400, 200);
  textStyle(BOLD);
}
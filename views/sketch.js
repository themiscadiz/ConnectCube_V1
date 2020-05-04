let serial;
let fromSerial = 0;

let img0;
let img1;
let img2;
let currentImage;

let currentTag = 0;
let previousTag = 0;

const userOneUrl = "/api/5e9a421dd1778e34ba30f0e0"
const userTwoUrl = "/api/5e769cb990b622dbb789ae4e"

let timer;

let serialPort = "/dev/tty.usbmodem14301";



async function preload(){
  // loadGet();

  let  url = 'http://localhost:3000/api';
  httpGet(url, 'json', false, function(response) {
    // when the HTTP request completes, populate the variable that holds the
    // earthquake data used in the visualization.
    let earthquakes = response;
    //console.log(earthquakes);

  });
}

// change this to book
async function mySpecialRequest(url, _tagNumber){
  try{

    // // Update the value of this variable
    // catCount++;

    // *** update this with tag number, dynamically load as a function parameter
    let tagNumber = _tagNumber;

    // send to the backend the and update value of votes
    const options = {
      method: 'PUT',
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        "tag" : tagNumber
      })
    }
    //fetch and recieve the url with the value of vote, and storage in the data variable
    const data = await fetch(url,options);

    //converted into a json ans storage in result variable
    const result = await data.json();

    // // Send number of vote of a specific animal into the website
    // getVotesCat(result);
    console.log(result);
  }
  catch(err){
    return err;
  }
}



function setup() {
  createCanvas(400, 400);

  img0 = loadImage("assets/0.png");
  img1 = loadImage("assets/1.png");
  img2 = loadImage("assets/2.png");

  currentImage = img0;

  serial = new p5.SerialPort(); // make a new instance of  serialport librar
  serial.on('list', printList); // callback function for serialport list event
  serial.on('data', serialEvent); // callback for new data coming in
  serial.list(); // list the serial ports
  serial.open(serialPort); // open a port

  rectMode(CENTER);
  colorMode(HSB, 100, 100, 100);

  timer = 5000;

}

function draw() {
  // do your drawing stuff here
  background(255);
  let xsize = 50;
  let ysize = 50;

// timer stuff
  if (millis() > timer){
    // print("it's been 5 seconds!");
    loadGet();
    timer = timer + 5000;
  }

  currentTag = fromSerial;

  if (currentTag != previousTag) {

    if (currentTag == 1) {
      console.log(currentTag);
      // image(img1, 0, 0, 300, 300);
      // currentImage = img1;

      mySpecialRequest(userOneUrl, currentTag);

    }
    else if (currentTag == 2) {
      console.log(currentTag);
      // image(img2, 0, 0, 300, 300);
      // currentImage = img2;

      // api PUT

      mySpecialRequest(userOneUrl,currentTag);
      // httpDo(
      //   url,
      //   {
      //     method: 'GET',
      //     // Other Request options, like special headers for apis
      //     headers: { authorization: 'Bearer secretKey' }
      //   },
      //   function(res) {
      //     earthquakes = res;
      //   }
      // );

    }
  }

  image(currentImage, 0, 0, 300, 300);

  previousTag = currentTag;
}

// get the list of ports:
function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serialEvent() {
  // this is called when data is recieved, data will then live in fromSerial
  var stringFromSerial = serial.readLine();
  if (stringFromSerial.length > 0) {
    var trimmedString = trim(stringFromSerial);
    fromSerial = Number(trimmedString);
  }
}



// GET function using loadGet() | From Postman

async function loadGet(){
  console.log("running loadGet")


  // ????
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  // var urlencoded = new URLSearchParams();
  // urlencoded.append("animal", "dog");
  // urlencoded.append("votes", "0");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // body: urlencoded,
    redirect: 'follow'
  };


  const data = await fetch("http://localhost:3000/api",requestOptions);
  const result = await data.json();

  if(result[0].tag == 1){
    // set image to book
    currentImage = img1;

  }
  else{
    currentImage = img2;

  }
  console.log(result[0].tag);

  // catCount = result[0].tag;
  // dogCount = result[1].votes;
  // birdCount = result[2].votes;
  // fishCount = result[3].votes;

  gotData = true;

  // showAllVotes();
}


//----------------------------------
// Arduino Code for the Project

/*
 *
 * All the resources for this project: https://randomnerdtutorials.com/
//  * Modified by Rui Santos
//  *
//  * Created by FILIPEFLOP
//  *
//  */

// #include <SPI.h>
// #include <MFRC522.h>

// #define ledPin_1 2
// #define ledPin_2 3

// #define SS_PIN 10
// #define RST_PIN 9
// MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

// void setup()
// {
//   Serial.begin(9600);   // Initiate a serial communication
//   SPI.begin();      // Initiate  SPI bus
//   mfrc522.PCD_Init();   // Initiate MFRC522

//   pinMode(ledPin_1, OUTPUT);
//   pinMode(ledPin_2, OUTPUT);


//  // Serial.println("Approximate your card to the reader...");
//   //Serial.println();

// }
// void loop()
// {
//   // Look for new cards
//   if ( ! mfrc522.PICC_IsNewCardPresent())
//   {
//     return;
//   }
//   // Select one of the cards
//   if ( ! mfrc522.PICC_ReadCardSerial())
//   {
//     return;
//   }
//   //Show UID on serial monitor
//   //Serial.print("UID tag :");
//   String content= "";
//   byte letter;
//   for (byte i = 0; i < mfrc522.uid.size; i++)
//   {
//      //Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
//      //Serial.print(mfrc522.uid.uidByte[i], HEX);
//      content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
//      content.concat(String(mfrc522.uid.uidByte[i], HEX));
//   }
//  // Serial.println();
//   //Serial.print("Message : ");
//   content.toUpperCase();
//   if (content.substring(1) == "59 9D 22 D9") //change here the UID of the card/cards that you want to give access
//   {
//     digitalWrite(ledPin_1, HIGH);
//     digitalWrite(ledPin_2, LOW);

//     //byte valueToSend = 1;
//     //Serial.println(valueToSend);


//     //Serial.println("TAG_1");
//     //Serial.println();


//     int valueToSend = 1;
//     Serial.println(valueToSend);

//     delay(1000);
//   }

//  else  if  (content.substring(1) == "69 A1 22 D9")  {
//     //Serial.println("TAG_2");


//     digitalWrite(ledPin_1, LOW);
//     digitalWrite(ledPin_2, HIGH);

//     //byte valueToSend = 2;
//     //Serial.println(valueToSend);

//     int valueToSend = 2;
//     Serial.println(valueToSend);

//     delay(1000);
//   }

// }

//----------------------------------

/*
// Original Example Arduino Code
void setup() {
  Serial.begin(9600);
}
void loop() {
  int analogValue = analogRead(A0);
  Serial.println(analogValue);
  delay(50);
}
*/

//Reference material
/* Tutorial from:
Introduction to Physical Computing
Danny Rozin
ITP/NYU

*/

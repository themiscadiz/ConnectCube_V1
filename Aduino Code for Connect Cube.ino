/* Arduino Code for the Project
 *
 * All the resources for this project: https://randomnerdtutorials.com/
 * Modified by Rui Santos
 *
 * Created by FILIPEFLOP
 *
 */

#include <SPI.h>
#include <MFRC522.h>

#define ledPin_1 2
#define ledPin_2 3

#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

void setup()
{
  Serial.begin(9600);   // Initiate a serial communication
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522

  pinMode(ledPin_1, OUTPUT);
  pinMode(ledPin_2, OUTPUT);


 // Serial.println("Approximate your card to the reader...");
  //Serial.println();

}
void loop()
{
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial())
  {
    return;
  }
  //Show UID on serial monitor
  //Serial.print("UID tag :");
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    //  Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    //  Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
 // Serial.println();
  //Serial.print("Message : ");
  content.toUpperCase();
  if (content.substring(1) == "59 9D 22 D9") //change here the UID of the card/cards that you want to give access
  {
    digitalWrite(ledPin_1, HIGH);
    digitalWrite(ledPin_2, LOW);

    //byte valueToSend = 1;
    //Serial.println(valueToSend);


    //Serial.println("TAG_1");
    //Serial.println();


    int valueToSend = 1;
    Serial.println(valueToSend);

    delay(1000);
  }

 else  if  (content.substring(1) == "69 A1 22 D9")  {
    //Serial.println("TAG_2");


    digitalWrite(ledPin_1, LOW);
    digitalWrite(ledPin_2, HIGH);

    //byte valueToSend = 2;
    //Serial.println(valueToSend);

    int valueToSend = 2;
    Serial.println(valueToSend);

    delay(1000);
  }

}

// ----------------------------------

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
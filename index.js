const express = require('express')
const app = express()
//const port = 3030
const path = require('path');
const fs = require('fs');
const indexLocation = path.join(__dirname + "/views/");

//
const config = require('./config');
const PORT = config.PORT;
//


//Database setup
const Datastore = require('nedb');
const pathToData = path.resolve(__dirname, "db/db")
const db = new Datastore({ filename: pathToData});
db.loadDatabase();

// ********* Mongo DB Setup
// read in mongoose library
const mongoose = require('mongoose');
// read in the URI to our MongoDB Atlas 
const MONGODB_URI = config.MONGODB_URI;
// Use mongoose to connect to our MongoDB Atlas server
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// --- connect to your collection ---
const todos = require('./models/todo');


// Send files from the public directory
app.use(express.static( path.resolve(__dirname, 'views') ));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

//send static HTML file, 
app.get('/', function(req, res) {
    res.sendFile(indexLocation)
});

let cat = 0;
let dog = 0;
let bird = 0;
let fish = 0;


//*********** test MongoDB
// GET: "api/"
app.get("/api/", async (req, res) => {
    try{
      const data = await todos.find();
      res.json(data);
    } catch(error){
      console.error(error);
      res.json(error);
    }
  });


// To ADD an item to the database
// POST: "api/v1/todos"
app.post("/api/", async (req, res) => {
    try{
      // const newData = {
      //   animal: req.body.animal,
      //   votes: req.body.votes
      // }

      const newData = {
          user: req.body.user,
          tag: req.body.tag
        }

        const data = await todos.create(newData);
        res.json(data);
    } catch(error){
      console.error(error);
      res.json(error);
    }
  });

// To UPDATE votes
// PUT: "api/"

// Recieving message from main.js (frontend)
app.put("/api/:id", async (req, res) => {

//store the id
    const selectedItemId = req.params.id;
//store the votes
    const updatedData = req.body;
        
        try{
           
            //communicating with the database, sending ID, and updating value and storage response in data variable
            const data = await todos.findOneAndUpdate({_id: selectedItemId}, updatedData, {new:true});
            
            //send response back to frontend (main.js)
            res.json(
                {message: data.tag}
            )
        } catch(error){
            console.error(error);
            res.json(error);
        }
  });


// DELETE
  app.delete('/api/:id', async (req, res) => {
    try {
    const deletedDocument = await todos.findOneAndDelete(req.params.id);
    res.json({"message":"successfully removed item", "data": JSON.stringify(deletedDocument) });
    } catch (error) {
      res.json({ error: JSON.stringify(error) });
    }
  });

// Start listening
app.listen(PORT, () => {
    console.log(`see the magic: http://localhost:${PORT}`);
  })
const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");

// Create Express app
const app = express();

// Add CORS to all routes and methods
app.use(cors());

// Enable parsing of JSON bodies
app.use(express.json());

// Initialize parameters
const port = 3600;
const dbName = "mean-passwordManager";
const collectionName = "passwords";

// database connection string
const dbUrl = 'mongodb+srv://admin:xOuG5xzD7E4ZZCdF@mycluster.upxjjyn.mongodb.net/?retryWrites=true&w=majority'

// database connection & start web server
mongoose.connect(dbUrl, {
  dbName: dbName
  })
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log("Listening on " + port + ".");
    });  
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  })

//mongoose schema and models
const passwordSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  app: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  }
})

const passwordModel = mongoose.model('Password', passwordSchema);

// Define server routes
// List all passwords
// TODO: Task - Write whole GET Request
app.route("/passwords").get(async (req, res) => {
    let passwords = [];
  
    passwords = await passwordModel.find({});

    res.json(passwords);
});

// Get a password
app.route("/password-edit/:id").get(async (req, res) => {
    const id = req.params.id;
    const result = await passwordModel.findOne({_id: new ObjectId(id)});
  
    if (!result) {
      res.status(404).json({error: "Could not find"});
      return;
    }
  
    res.json(result);
});

// Create a new password
app.route("/passwords-edit").post(async (req, res) => {
    const doc = new passwordModel(req.body);

    const result = await doc.save();

    res.status(201).json({ _id: result.insertedId });
  });

// Update a password
app.route("/passwords-edit/:id").put(async (req, res) => {
    const id = req.params.id;
    const doc = req.body;

    // make sure the id field is correct object type
    doc._id = new ObjectId(id);

    const result = await passwordModel
                            .findByIdAndUpdate(req.params.id, req.body);
  
    if (result.matchedCount == 0) {
      res.status(404).json({});
      return;
    }
  
    res.json({});
  });

// Delete a person
app.route("/passwords/:id").delete(async (req, res) => {
    const id = req.params.id;
  
    // TODO: Task - Write delete query only
    await passwordModel.findByIdAndDelete(req.params.id);
  
    res.json({});
  });
const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const bodyParser = require('body-parser');
const cors = require("cors");
var serviceAccount = require("./key.json"); //Path to your firestore service account
//Initialize Firestore
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const todosCollection = db.collection("todos");
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(cors());

// Add a new todo
app.post("/todos", (req, res) => {
  const {title, description} = req.body;
  const newToDo = {title, description, createdAt: new Date()};
  todosCollection
    .add(newToDo)
    .then((docRef) => {
      res.status(201).json({ id: docRef.id, ...newToDo });
    })
    .catch((error) => {
      res.status(500).json({error : error.message });
    });
});

//Get all todos
app.get("/todos", (req, res) => {
  todosCollection
    .get()
    .then((docs) => {
      const todos = [];
      docs.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(todos);
    })
    .catch((error) => {
      res.status(500).json({error : error.message });
    });
});

// Update a todo by Id
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const updatedTodo = { title, description, updatedAt: new Date() };
  todosCollection
    .doc(id)
    .update(updatedTodo)
    .then(() => {
      res.status(200).json( {id, ...updatedTodo });
    })
    .catch((error) => {
      res.status(500).json({error : error.message });
    });
});

// Delete a todo by Id
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todosCollection
    .doc(id)
    .delete()
    .then(() => {
      res.status(200).json({message : "ToDo deleted successfully"});
    })
    .catch((error) => {
      res.status(500).json({error : error.message });
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on `http://localhost:3000`");
});
import React, { useState, useEffect } from "react";

const App = () => {
    const [todos, setTodos] = useState([]); // List of TODOS
    const [title, setTitle] = useState(""); // New TODO title
    const [description, setDescription] = useState(""); // New TODO description
    const [editingId, setEditingId] = useState(null); // ID of the TODO being edited

    // Fetch all TODOs from the server
    const fetchTodos = () => { 
        fetch("http://localhost:3000/todos")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching todos:", error));
    };

    // Create a new TODO
    const addTodo = () => {
        const newTodo = { title, description };

        fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        })
        .then((response) => response.json())
        .then(() => {
            setTitle("");
            setDescription("");
            fetchTodos();
        })
        .catch((error) => console.error("Error adding todo:", error));
    };

    // Update an existing TODO
    const updateTodo = () => {

        const updatedTodo = { title, description };
        
        fetch(`http://localhost:3000/todos/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
        })
        .then(() => {
            setEditingId(null);
            setTitle("");
            setDescription("");
            fetchTodos();
        })
        .catch((error) => console.error("Error updating todo:", error));
    
    };
    
    // Delete a TODO
    const deleteTodo = (id) => {
        fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" })
            .then(() => fetchTodos())
            .catch((error) => console.error("Error deleting todo:", error));
        };
            
    // Populate the form for editing.
    const startEditing = (todo) => {
        setEditingId(todo.id);
        setTitle(todo.title);
        setDescription(todo.description);
    };

    // Fetch TODOs when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
      <div style={{    
        padding: "40px",
        maxWidth: "800px",        
        margin: "0 auto",       
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <h1 style={{
           color: "#2c3e50",
           marginBottom: "30px",        
           textAlign: "center"        
        }}>TODO App</h1>
        
        <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px"
        }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                flex: "1",
                fontSize: "16px"
            }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                flex: "2",
                fontSize: "16px"
            }}
          />
          {editingId? (
          <button
            onClick={updateTodo} 
            style={{
                padding: "10px 20px",
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.25"
            }}
          >Update TODO</button>
        ):(
          <button
            onClick={addTodo}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "background-color 0.2s"
                }}
          >Add TODO</button>
        )}
    </div>
                
    <ul style={{ listStyleType: "none", padding: 0 }}>        
        {todos.map((todo) => (
            <li 
                key={todo.id}
                style={{
                    marginBottom:
                    "15px",
                    backgroundColor:
                    "white",
                    borderRadius: "8px",
                    padding: "20px",    
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.25",
                    ':hover': {
                    transform: "translateY(-2px)"
                    }
                }}
            >    
              <h3 style={{
                margin: "0 0 10px 0",
                color: "#2c3e50"
              }}>{todo.title}</h3>
              <p style={{
                margin: "0 0 15px 0",
                color: "#666"
              }}>{todo.description}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                onClick={() => startEditing(todo)}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#f39c12",
                    color:
                    "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                }}
              >  
                Edit
              </button>
              <button
                onClick={() => deleteTodo (todo.id)}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
     </div>
    );
};     
export default App;
import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=10";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTasks = localStorage.getItem("activeTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setTasks(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async () => {
    if (text.trim() === "") return;

    const newTask = { title: text, completed: false, id: Date.now() };

    setTasks([newTask, ...tasks]);
    setText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>FocusList</h1>

      <div className="input-group">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Добавить задачу"
        />
        <button onClick={addTask}>+</button>
      </div>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Все</button>
        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Активные</button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Завершённые</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? "done" : ""}>
            <span onClick={() => toggleComplete(task.id)}>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

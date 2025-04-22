import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const API_URL = "https://pit-4.onrender.com/todos";

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);


  const fetchTodos = async () => {
    try {
      let url = API_URL;
      if (filter === "completed") url += "/status/true";
      else if (filter === "pending") url += "/status/false";

      const res = await fetch(url + "/");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch(API_URL + "/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    });
    setTitle("");
    fetchTodos();
  };

  const updateTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle, completed: todos.find(t => t.id === id).completed }),
    });
    setEditingId(null);
    setEditingTitle("");
    fetchTodos();
  };

  const toggleComplete = async (id, currentStatus) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todos.find(t => t.id === id).title, completed: !currentStatus }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen p-4 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">📝 To-Do List</h1>
            <button
              className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <div className="flex mb-4">
            <input
              className="flex-1 px-3 py-2 border dark:border-gray-700 rounded-l"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add new task..."
            />
            <button className="bg-blue-500 text-white px-4 rounded-r" onClick={addTodo}>
              Add
            </button>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <button onClick={() => setFilter("all")} className="px-2 py-1 border rounded">All</button>
            <button onClick={() => setFilter("completed")} className="px-2 py-1 border rounded">Completed</button>
            <button onClick={() => setFilter("pending")} className="px-2 py-1 border rounded">Pending</button>
          </div>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className="flex justify-between items-center border-b py-2">
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                    className="mr-2"
                  />
                  {editingId === todo.id ? (
                    <input
                      className="flex-1 px-2 py-1 border rounded mr-2"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && updateTodo(todo.id)}
                    />
                  ) : (
                    <span className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
                      {todo.title}
                    </span>
                  )}
                </div>
                {editingId === todo.id ? (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => updateTodo(todo.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const API_URL = "http://localhost:8000/todos";

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

  const editTodo = (id, currentTitle) => {
    setEditId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = async () => {
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, completed: todos.find(t => t.id === editId).completed }),
    });
    setEditId(null);
    setEditTitle("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  return (
    <div className={darkMode ? "dark" : ""}>
  <div className="min-h-screen bg-soft dark:bg-darkbg text-gray-800 dark:text-white p-6 transition-colors">
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary">📝 To-Do List</h1>
        <button
          className="bg-accent text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-4 py-2 rounded-lg border-2 border-primary dark:bg-gray-700"
          placeholder="Add new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => setFilter("all")} className="bg-soft dark:bg-gray-700 px-4 py-2 rounded-full hover:bg-primary hover:text-white">All</button>
        <button onClick={() => setFilter("completed")} className="bg-success text-white px-4 py-2 rounded-full hover:bg-emerald-600">Completed</button>
        <button onClick={() => setFilter("pending")} className="bg-warning text-white px-4 py-2 rounded-full hover:bg-yellow-500">Pending</button>
      </div>

          <ul className="space-y-4">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                    className="w-5 h-5"
                  />
                  {editId === todo.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-white dark:bg-gray-600 rounded px-3 py-1 w-full"
                    />
                  ) : (
                    <span className={`${todo.completed ? "line-through text-gray-500 dark:text-gray-400" : ""} text-lg`}>
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editId === todo.id ? (
                    <button onClick={saveEdit} className="text-blue-500 hover:underline">Save</button>
                  ) : (
                    <button onClick={() => editTodo(todo.id, todo.title)} className="text-indigo-500 hover:underline">Edit</button>
                  )}
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

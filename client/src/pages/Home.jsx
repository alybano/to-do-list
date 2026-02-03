import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  // Fetch lists from backend
  const fetchLists = async () => {
    try {
      const res = await axios.get("http://localhost:3000/get-list"); // corrected URL
      if (res.data.success) {
        setLists(res.data.list);  // response key 'list' matches backend
      } else {
        setLists([]);
      }
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  };

  // Add new list
  const addList = async () => {
    if (!newTitle.trim()) return; // prevent empty titles

    try {
      const res = await axios.post("http://localhost:3000/add-list", { listTitle: newTitle }); // corrected URL and payload
      if (res.data.success) {
        setNewTitle("");
        fetchLists();
      } else {
        alert("Failed to add list");
      }
    } catch (error) {
      console.error("Add list error:", error);
    }
  };

  // Delete list
  const deleteList = async (id) => {
    try {
      // Assuming your backend supports this route. If not, backend needs DELETE /lists/:id route.
      await axios.delete(`http://localhost:3000/lists/${id}`); 
      fetchLists();
    } catch (error) {
      console.error("Delete list error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">To Do List</h1>

      {/* Add List */}
      <div className="flex gap-2 mb-6">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New list title"
          className="px-4 py-2 rounded border w-64"
        />
        <button
          onClick={addList}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add List
        </button>
      </div>

      {/* List Folders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div
              key={list.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2
                onClick={() => navigate(`/list-item/${list.id}`)}
                className="text-xl font-semibold cursor-pointer"
              >
                {list.title}
              </h2>

              <button
                onClick={() => deleteList(list.id)}
                className="text-red-500 text-sm mt-2"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No lists available</p>
        )}
      </div>
    </div>
  );
}

export default Home;

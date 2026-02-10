import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const colors = [
  "bg-blue-600",
  "bg-red-600",
  "bg-yellow-400",
  "bg-green-500",
  "bg-purple-600",
  "bg-pink-500",
]; // colors for cards

function Home() {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
    fetchLists();
  }, []);

  const checkSession = async () => {
    try {
      const res = await axios.get("https://to-do-list-ws11.onrender.com/get-session", {
        withCredentials: true,
      });
      if (!res.data.session) navigate("/");
    } catch (err) {
      navigate("/");
    }
  };

  const fetchLists = async () => {
    try {
      const res = await axios.get("https://to-do-list-ws11.onrender.com/get-list", {
        withCredentials: true,
      });
      if (res.data.success) setLists(res.data.list);
      else setLists([]);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  };

  const addList = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(
        "https://to-do-list-ws11.onrender.com/add-list",
        { listTitle: newTitle },
        { withCredentials: true }
      );
      if (res.data.success) {
        setNewTitle("");
        fetchLists();
      } else alert("Failed to add list");
    } catch (error) {
      console.error("Add list error:", error);
    }
  };

  const deleteList = async (id) => {
    try {
      const res = await axios.delete(
        `https://to-do-list-ws11.onrender.com/delete-list/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) fetchLists();
      else alert("Failed to delete list");
    } catch (error) {
      console.error("Delete list error:", error);
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingListId(id);
    setEditedTitle(currentTitle);
  };

  const cancelEditing = () => {
    setEditingListId(null);
    setEditedTitle("");
  };

  const updateListTitle = async (id) => {
    if (!editedTitle.trim()) return;
    try {
      const res = await axios.put(
        `https://to-do-list-ws11.onrender.com/update-list/${id}`,
        { title: editedTitle },
        { withCredentials: true }
      );
      if (res.data.success) {
        setEditingListId(null);
        setEditedTitle("");
        fetchLists();
      } else alert("Failed to update list title");
    } catch (error) {
      console.error("Update list error:", error);
    }
  };

  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center"
      style={{
        background:
          "radial-gradient(circle at top left, #f8fafc, #dbeafe, #e0e7ff)",
      }}
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-900">My To Do List</h1>

      {/* Add List */}
      <div className="flex gap-3 mb-12 w-full max-w-4xl">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New List Title"
          className="flex-grow px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
        />
        <button
          onClick={addList}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 active:scale-95 transition"
        >
          Add List
        </button>
      </div>

      {/* List Folders */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl w-full">
        {lists.length > 0 ? (
          lists.map((list, index) => {
            const colorClass = colors[index % colors.length];
            return (
              <div
                key={list.id}
                className={`${colorClass} rounded-2xl p-6 shadow-lg flex flex-col justify-between min-w-[250px] max-w-[280px] h-40 text-white hover:shadow-2xl transition`}
              >
                {editingListId === list.id ? (
                  <>
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="px-2 py-1 rounded border w-full text-black"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateListTitle(list.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2
                      onClick={() => navigate(`/list-item/${list.id}`)}
                      className="text-xl font-semibold cursor-pointer"
                    >
                      {list.title}
                    </h2>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => startEditing(list.id, list.title)}
                        className="text-white text-sm underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteList(list.id)}
                        className="text-white text-sm underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-700">No lists found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
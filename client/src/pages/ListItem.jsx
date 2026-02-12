import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../components/api";

const colors = [
  "bg-blue-600",
  "bg-red-600",
  "bg-yellow-400",
  "bg-green-500",
  "bg-purple-600",
  "bg-pink-500",
];

function ListItem() {
  const { id } = useParams(); // list ID from route
  const navigate = useNavigate();

  const [listTitle, setListTitle] = useState("Checklist");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemText, setEditedItemText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchListTitle();
        await fetchItems();
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const fetchListTitle = async () => {
    try {
      const res = await axiosInstance.get(`/get-list/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) setListTitle(res.data.list.title);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get(`/get-items/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setItems(
          res.data.items.map((item) => ({
            ...item,
            status: item.status === "completed",
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/lists/${id}/items`,
        { description: newItem },
        { withCredentials: true }
      );
      if (res.data.success) {
        setNewItem("");
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const res = await axiosInstance.delete(
        `/lists/${id}/items/${itemId}`,
        { withCredentials: true }
      );
      if (res.data.success) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status ? "pending" : "completed";
      const res = await axiosInstance.put(
        `/lists/${id}/items/${item.id}`,
        { description: item.description, status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async (item) => {
    if (!editedItemText.trim()) return;
    try {
      const res = await axiosInstance.put(
        `/lists/${id}/items/${item.id}`,
        {
          description: editedItemText,
          status: item.status ? "completed" : "pending",
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        setEditingItemId(null);
        setEditedItemText("");
        fetchItems();
      }
    } catch (err) {
      console.error(err);
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
  <button
  onClick={() => navigate("/home")}
  className="flex flex-col items-center mb-6 hover:scale-105 transition self-start"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3} // Thicker stroke
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    />
  </svg>
  <span className="text-sm text-blue-500 mt-1">Back to Lists</span>
</button>

  <h1 className="text-4xl font-bold mb-8">{listTitle}</h1>

  {/* Add Item */}
  <div className="flex gap-3 mb-12 w-full max-w-4xl">
    <input
      value={newItem}
      onChange={(e) => setNewItem(e.target.value)}
      placeholder="New Task"
      className="flex-grow px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
    />
    <button
      onClick={addItem}
      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition"
    >
      Add Task
    </button>
  </div>

      {/* Items as rectangular cards */}
      <div className="flex flex-col gap-4 w-full max-w-4xl">
        {items.length === 0 && <p className="text-gray-700">No tasks found.</p>}

        {items.map((item, index) => {
          const colorClass = colors[index % colors.length];
          return (
            <div
              key={item.id}
              className={`${colorClass} rounded-xl px-4 py-3 shadow-lg flex justify-between items-center text-white hover:shadow-2xl transition`}
            >
              {editingItemId === item.id ? (
                <div className="flex flex-col w-full gap-2">
                  <input
                    className="px-2 py-1 rounded border w-full text-black"
                    value={editedItemText}
                    onChange={(e) => setEditedItemText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateItem(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingItemId(null);
                        setEditedItemText("");
                      }}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 w-full">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={() => toggleStatus(item)}
                    className="cursor-pointer w-5 h-5"
                  />
                  <span
                    className={
                      item.status
                        ? "line-through text-gray-200 flex-grow"
                        : "text-white font-medium flex-grow"
                    }
                  >
                    {item.description}
                  </span>
                  <button
                    onClick={() => {
                      setEditingItemId(item.id);
                      setEditedItemText(item.description);
                    }}
                    className="text-white text-sm underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-white text-sm underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListItem;
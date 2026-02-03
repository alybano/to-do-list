import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ListItem() {
  const { id } = useParams(); // list_id from route
  const navigate = useNavigate();

  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchListTitle();
    fetchItems();
  }, [id]);

  // Fetch list title (optional, but better UX)
  const fetchListTitle = async () => {
    try {
      const res = await axios.get("http://localhost:3000/get-list");
      if (res.data.success) {
        const foundList = res.data.list.find((list) => list.id === parseInt(id));
        setListTitle(foundList ? foundList.title : "Checklist");
      }
    } catch (error) {
      console.error("Failed to fetch list title:", error);
    }
  };

  // Fetch all items, then filter by list_id
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/get-items");
      if (res.data.success) {
        const filtered = res.data.items.filter(
          (item) => item.list_id === parseInt(id)
        );
        setItems(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  // Add new item
  const addItem = async () => {
    if (!newItem.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/lists/${id}/items`,
        { description: newItem, status: false }
      );
      if (res.data.success) {
        setNewItem("");
        fetchItems();
      } else {
        alert("Failed to add item");
      }
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/lists/${id}/items/${itemId}`
      );
      if (res.data.success) {
        fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Delete item error:", error);
    }
  };

  // Optional: Toggle status (checkbox)
  const toggleStatus = async (item) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/lists/${id}/items/${item.id}`,
        { description: item.description, status: !item.status }
      );
      if (res.data.success) {
        fetchItems();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  // Optional: Edit item description
  // You can add inline editing or a modal if needed, but keeping it simple here

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate("/home")}
        className="text-blue-500 mb-4"
      >
        ← Back to Lists
      </button>

      <h1 className="text-3xl font-bold mb-6">{listTitle}</h1>

      {/* Add Item */}
      <div className="flex gap-2 mb-6">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New task"
          className="px-4 py-2 rounded border w-64"
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Items */}
      <ul className="space-y-3">
        {items.length === 0 && <p>No tasks found.</p>}
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.status}
                onChange={() => toggleStatus(item)}
                className="cursor-pointer"
              />
              <span className={item.status ? "line-through text-gray-500" : ""}>
                {item.description}
              </span>
            </div>

            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListItem;

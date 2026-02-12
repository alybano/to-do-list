import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./api";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await axiosInstance.get("/get-session", {
        withCredentials: true,
      });

      if (res.data.session) {
        setUser({
          id: res.data.userId,
          username: res.data.username,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white">
      <h1
        onClick={() => navigate("/home")}
        className="text-xl font-bold cursor-pointer"
      >
        To-Do App
      </h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Hi, <strong>{user.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          Login
        </button>
      )}
    </header>
  );
}

export default Header;
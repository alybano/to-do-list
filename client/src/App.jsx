import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./components/api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await axiosInstance.post(
      "/login",
      { username, password }, // ✅ removed withCredentials here
      { withCredentials: true } // ✅ correct place
    );

    if (res.status === 200 && res.data.success) {
      navigate("/home");
    } else {
      alert(res.data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert(err.response?.data?.message || "Invalid username or password");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-lg">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 border border-white/40">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Welcome Back
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-5 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
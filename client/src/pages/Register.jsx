import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/register
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  // LOGIN HANDLER
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (res.status === 200 && res.data.success) {
        navigate("/home"); // go to home after login
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // REGISTER HANDLER
  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/register", {
        name,
        username,
        password,
        confirm,
      });

      if (res.status === 200 && res.data.success) {
        alert("Registered successfully! Please login.");
        setIsLogin(true); // switch to login after successful registration
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at top left, #f8fafc, #dbeafe, #e0e7ff)",
      }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-blue-700 text-white py-3 rounded-lg mt-6 hover:bg-blue-800 active:scale-95 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {/* Toggle Link */}
        <p className="mt-4 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create Account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
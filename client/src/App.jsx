// client/src/App.jsx
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at top left, #f8fafc, #dbeafe, #e0e7ff)",
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left content */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
            Manage Your To-Do Lists
          </h1>
          <p className="text-gray-700 mb-8">
            Organize tasks, track progress, and never forget what’s important. 
            Sign up or log in to start managing your day efficiently.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 active:scale-95 transition w-max"
          >
            Get Started
          </button>
        </div>

        {/* Right illustration (placeholder box) */}
        <div
          className="flex-1 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center"
          style={{ minHeight: "300px" }}
        >
          {/* You can replace this with an actual SVG or image */}
          <div className="w-64 h-64 bg-white/30 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            Illustration
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
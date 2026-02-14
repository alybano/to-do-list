// client/src/App.jsx
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg"
      style={{
        background: "radial-gradient(circle at top left, #f8fafc, #dbeafe, #e0e7ff)",
      }}
    >
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 border border-white/40 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome to the To-Do List App
        </h1>

        <p className="text-gray-700 mb-8">
          Manage your tasks efficiently. Sign up or log in to continue.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Go to Register / Login
        </button>
      </div>
    </div>
  );
}

export default App;
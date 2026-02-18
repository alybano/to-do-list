// client/src/App.jsx
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #f8fafc, #dbeafe, #e0e7ff)",
      }}
    >
      {/* Floating gradient background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[30rem] h-[30rem] bg-purple-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>

      {/* Main content box */}
      <div
        className="w-full max-w-6xl relative flex flex-col md:flex-row items-center justify-between bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-16"
        style={{ minHeight: "80vh" }}
      >
        {/* Left Section */}
        <div className="flex-1 space-y-8 text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold text-blue-700 tracking-tight leading-tight">
            To Do List
          </h1>

          <p className="text-gray-700 text-lg md:text-xl max-w-xl leading-relaxed">
            Stay organized. Stay focused. Take control of your productivity
            with a beautifully simple task manager built for clarity and
            efficiency.
          </p>

          {/* Single Modern Button */}
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition text-lg"
          >
            Get Started →
          </button>
        </div>

        {/* Right Section - Modern Abstract Design */}
        <div className="flex-1 relative flex items-center justify-center mt-16 md:mt-0">
          <div className="w-72 h-72 bg-blue-500 rounded-3xl rotate-12 opacity-80 shadow-2xl"></div>
          <div className="absolute w-72 h-72 bg-purple-600 rounded-3xl -rotate-12 opacity-70 shadow-2xl"></div>
        </div>

        {/* Premium Footer */}
<div className="absolute bottom-6 w-full text-center">
  <p className="text-gray-500 text-sm tracking-wide opacity-80 hover:opacity-100 transition">
    © {new Date().getFullYear()} Alyssa Ban-o • All Rights Reserved
  </p>
</div>
      </div>
    </div>
  );
}

export default App;
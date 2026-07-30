import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Notes from "./pages/Notes.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar Container */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-wide">
          📝 StudySphere Notes
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">
            Notes
          </Link>

          {token ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
       
          <Route path="/" element={<Notes token={token} />} />
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register onLogin={setToken} />} />
        </Routes>
      </main>
    </div>
  );
}
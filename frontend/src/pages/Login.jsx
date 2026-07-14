import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaRobot,
} from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await API.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      login(response.data.access_token);

      alert("Login Successful ✅");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Invalid Email or Password ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Section */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-indigo-700 text-white p-12">

          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-8">
            <FaRobot className="text-4xl" />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back
          </h1>

          <p className="mt-6 text-blue-100 text-lg leading-8">
            Login to CampusAI Marketplace and continue buying, selling,
            and negotiating smarter with AI.
          </p>

        </div>

        {/* Right Section */}

        <div className="p-10 lg:p-12">

          <h2 className="text-4xl font-bold text-gray-800">
            Login
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-5 text-blue-600" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-5 text-blue-600" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              <FaSignInAlt />
              Login
            </button>

          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">
              Don't have an account?
            </span>

            <Link
              to="/signup"
              className="ml-2 text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
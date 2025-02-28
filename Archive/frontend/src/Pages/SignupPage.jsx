import { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-email", { email });
      setMessage(res.data.message);
    } catch (error) {
        console.error("Signup Error:", error);
      setMessage("Failed to send email");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Send Verification Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-gray-700 bg-gray-100 p-2 rounded">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;

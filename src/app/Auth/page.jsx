"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState("login"); // "login" | "register" | "forgot"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form States
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    console.log("Current view:", view);
  }, [view]);

  // Animation Variants
  const variants = {
    login: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: 90 },
    },
    register: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 },
    },
    forgot: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 },
    },
  };

  // Handle Login API Call (Master Admin)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/master/login-master-admin",
        loginForm
      );
      console.log("Login Response:", response.data);

      // Store authentication state
      localStorage.setItem("isLoggedIn", "true");
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      
      // Navigate to Dashboard on success
      setSuccess("Login successful!");
      router.push("/Dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };
  // Handle Register API Call (Master Admin)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (registerForm.password !== registerForm.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/master/register-master-admin",
        {
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
        }
      );

      console.log("Register Response:", response);
      setSuccess("Registration successful! Please login.");
      setView("login"); // Switch to login view
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  // Handle Forgot Password API Call
  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email: loginForm.email }
      );

      console.log("Forgot Password Response:", response.data);
      setSuccess("Password reset link sent to your email.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  // Render Forms Based on View
  const renderContent = () => {
    if (view === "login") {
      return (
        <motion.div
          key="login"
          className="absolute inset-0 bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-700"
          initial={variants.login.initial}
          animate={variants.login.animate}
          exit={variants.login.exit}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          {error && (
            <div className="text-center text-red-500 font-medium mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="text-center text-green-500 font-medium mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              required
            />

            <motion.input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              required
            />

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold"
            >
              Login
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            {/* <span
              onClick={() => setView("forgot")}
              className="text-sm text-indigo-400 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span> */}
            <br />
            <span
              onClick={() => setView("register")}
              className="text-sm text-indigo-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </div>
        </motion.div>
      );
    } else if (view === "register") {
      return (
        <motion.div
          key="register"
          className="absolute inset-0 bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-700"
          initial={variants.register.initial}
          animate={variants.register.animate}
          exit={variants.register.exit}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
          {error && (
            <div className="text-center text-red-500 font-medium mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="text-center text-green-500 font-medium mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <motion.input
              type="text"
              placeholder="Full Name"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
              required
            />

            <motion.input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              required
            />

            <motion.input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              required
            />

            <motion.input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-600"
              value={registerForm.confirm}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, confirm: e.target.value })
              }
              required
            />

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold"
            >
              Register
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            <span
              onClick={() => setView("login")}
              className="text-sm text-indigo-400 hover:underline cursor-pointer"
            >
              Back to Login
            </span>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-80 h-96">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </div>
  );
}
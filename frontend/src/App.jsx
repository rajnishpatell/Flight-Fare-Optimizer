import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ConfirmEmailChange from "./pages/auth/ConfirmEmailChange";
// Layout Components
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <Toaster position="top-center" reverseOrder={false} />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const NoLayout = ({ children }) => <>{children}</>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES WITH NAVBAR + FOOTER */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/results"
            element={
              <Layout>
                <SearchResults />
              </Layout>
            }
          />

          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          {/* AUTH PAGES WITHOUT NAVBAR/FOOTER */}

          <Route
            path="/forgot-password"
            element={
              <NoLayout>
                <ForgotPassword />
              </NoLayout>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <NoLayout>
                <ResetPassword />
              </NoLayout>
            }
          />

          <Route
            path="/verify-email/:token"
            element={
              <NoLayout>
                <VerifyEmail />
              </NoLayout>
            }
          />

          <Route
            path="/resend-verification"
            element={
              <NoLayout>
                <ResendVerification />
              </NoLayout>
            }
          />

          <Route
            path="/confirm-email-change/:token"
            element={
              <NoLayout>
                <ConfirmEmailChange />
              </NoLayout>
            }
          />

          {/* PROTECTED ROUTES (need layout) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

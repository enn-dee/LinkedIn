import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignUpPage from "./pages/auth/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import NotificationsPage from "./pages/NotificationPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Loader } from "lucide-react";
import NetworkPage from "./pages/NetworkPage";
function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "something went wrong");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="size-40 animate-spin" color="gray" />
      </div>
    );
  }
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/notifications"
          element={!authUser ? <Navigate to="/login" /> : <NotificationsPage />}
        />
        <Route
          path="/network"
          element={!authUser ? <Navigate to="/login" /> : <NetworkPage />}
        />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          success: {
            duration: 4000,
            style: {
              backgroundColor: "#4caf50",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "bold",
            },
          },
          error: {
            duration: 5000,
            style: {
              backgroundColor: "#f44336",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "bold",
            },
          },
          loading: {
            duration: 3000,
            style: {
              backgroundColor: "#2196f3",
              color: "#fff",
              borderRadius: "8px",
            },
          },
        }}
      />
    </Layout>
  );
}

export default App;

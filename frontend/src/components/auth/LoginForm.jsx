import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance
        .post("/auth/signin", userData)
        .then((res) => res.data);
      return response;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  function handleLogin(e) {
    e.preventDefault();
    loginMutation({ username, password });
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (6+ Characters)"
        className="input input-bordered w-full"
      />
      <button className="btn btn-primary w-full" disabled={isLoading}>
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;

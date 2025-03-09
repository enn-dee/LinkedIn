import { useQuery } from "@tanstack/react-query";
import React from "react";

import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
      } catch (error) {
        toast.error(error.message.data.message || "Something went wrong");
      }
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        
        return res.data;
      } catch (error) {
        toast.error(error.message.data.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser}/>
      </div>
    </div>
  );
};

export default HomePage;

import useGetUser from "@/core/hooks/useGetUser";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { loading } = useGetUser();
  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {loading ? <p>Loading...</p> : <Outlet />}
    </div>
  );
};

export default RootLayout;

"use client";
import React, { useState } from "react";
import { useRouter, redirect } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import Spanner from "@/components/spanner";
import { Navbar } from "@/components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    console.log(searchQuery);
  };

  const logout = () => {
    console.log("我要退出登陆啦！！！");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const { data, isError, status } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const data: any = await api.get("/me");
      return data.user;
    },
    retry: 1,
  });

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : false;
  if (isError || token === null) {
    router.push("/login");
  }
  return (
    <div className="min-h-screen">
      {status === "pending" ? (
        <Spanner />
      ) : (
        <>
          <Navbar
            value={searchQuery}
            user={data}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClearSearch={() => setSearchQuery("")}
            handleSearch={handleSearch}
            logout={logout}
          />
          {children}
        </>
      )}
    </div>
  );
};

export default DashboardLayout;

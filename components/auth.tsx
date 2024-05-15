"use client";
import { api } from "@/lib/api";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

export const AuthProtected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isError, isPending } = useQuery({
    queryFn: async () => {
      return await api.get("/me");
    },
    queryKey: ["auth"],
  });
  if (isError) {
    router.push("/login");
    return;
  }
  return <>{isPending ? <p>Loading...</p> : children}</>;
};

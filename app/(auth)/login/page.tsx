"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";

import { formSchema } from "./constants";
import { api } from "@/lib/api";

const LoginPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return api.post("/login", values);
    },
    onError: (error: any) => {
      toast({
        title: "Sign In",
        description: error.response.data.message,
        variant: "destructive",
        duration: 5000,
      });
    },
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    login(values);
  };
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center pt-28">
        {/* <div className=""> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-96 border rounded bg-white px-7 py-10 space-y-4"
          >
            <h4 className="text-2xl mb-7">Login</h4>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="m-0 p-0">
                    <input
                      type="text"
                      placeholder="Email"
                      className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded-e outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="m-0 p-0">
                    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
                      <input
                        {...field}
                        type={isShowPassword ? "text" : "password"}
                        placeholder={"Password"}
                        className="w-full text-sm bg-transparent outline-none py-3 mr-3 rounded"
                      />
                      {isShowPassword ? (
                        <FaRegEye
                          size={22}
                          className="cursor-pointer text-primary"
                          onClick={toggleShowPassword}
                        />
                      ) : (
                        <FaRegEyeSlash
                          size={22}
                          className="cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full text-sm  text-white p-2 rounded my-1"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Login"}
            </Button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-[#2B85FF] underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </Form>
        {/* </div> */}
      </div>
    </>
  );
};

export default LoginPage;

"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { formSchema } from "./constants";
import { api } from "@/lib/api";
import axios from "axios";

const SignUpPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return api.post("/register", values);
    },
    onError: (error: any) => {
      toast({
        title: "Sign up",
        description: error.response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Sign up",
        description: "Sign up success, please login.",
        duration: 2000,
      });
      router.push("/login");
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    signUp(values);
    form.reset();
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center pt-28">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-96 border rounded bg-white px-7 py-10 space-y-4"
            action="post"
          >
            <h4 className="text-2xl mb-7">SignUp</h4>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded-e outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
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
              className="w-full text-sm text-white p-2 rounded my-1"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Create Account"}
            </Button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#2B85FF] underline"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;

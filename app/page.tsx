"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";

export default function AuthPage() {
  const [selected, setSelected] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set auth cookie to satisfy middleware
    document.cookie = "auth_token=true; path=/; max-age=3600";

    router.push("/");
    router.refresh();
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Set auth cookie to satisfy middleware
    document.cookie = "auth_token=true; path=/; max-age=3600";

    router.push("/");
    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 items-center justify-center pt-8 pb-4">
          <h1 className={title({ size: "sm" })}>
            {selected === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-small text-default-500">
            {selected === "login"
              ? "Enter your details to access your account"
              : "Sign up to start capturing postmen"}
          </p>
        </CardHeader>
        <CardBody className="px-8 pb-8 overflow-hidden">
          {selected === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input
                isRequired
                label="Username"
                placeholder="Enter your username"
                type="text"
                value={username}
                variant="bordered"
                onValueChange={setUsername}
              />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                variant="bordered"
                onValueChange={setPassword}
              />
              <div className="flex w-full justify-end items-center px-1">
                <Link className="text-default-500" href="#" size="sm">
                  Forgot password?
                </Link>
              </div>
              <Button
                fullWidth
                color="primary"
                isLoading={isLoading}
                type="submit"
              >
                Sign In
              </Button>
              <div className="flex justify-center gap-1 text-small">
                <span className="text-default-500">
                  Don&apos;t have an account?
                </span>
                <Link
                  as="button"
                  className="cursor-pointer text-primary font-bold"
                  onPress={() => setSelected("signup")}
                >
                  Sign Up
                </Link>
              </div>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSignup}>
              <Input
                isRequired
                label="Username"
                placeholder="Choose a username"
                type="text"
                value={username}
                variant="bordered"
                onValueChange={setUsername}
              />
              <Input
                isRequired
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                variant="bordered"
                onValueChange={setEmail}
              />
              <Input
                isRequired
                label="Password"
                placeholder="Create a password"
                type="password"
                value={password}
                variant="bordered"
                onValueChange={setPassword}
              />
              <Button
                fullWidth
                color="primary"
                isLoading={isLoading}
                type="submit"
              >
                Sign Up
              </Button>
              <div className="flex justify-center gap-1 text-small">
                <span className="text-default-500">
                  Already have an account?
                </span>
                <Link
                  as="button"
                  className="cursor-pointer text-primary font-bold"
                  onPress={() => setSelected("login")}
                >
                  Log In
                </Link>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

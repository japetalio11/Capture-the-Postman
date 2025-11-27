"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { API_BASE_URL } from "@/lib/constants";

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

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set auth cookie to satisfy middleware
        document.cookie = `auth_token=${data.token}; path=/; max-age=3600`;

        router.push("/test");
        router.refresh();
      } else {
        const errorData = await response.json();

        alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set auth cookie to satisfy middleware
        document.cookie = `auth_token=${data.token}; path=/; max-age=3600`;

        router.push("/test");
        router.refresh();
      } else {
        const errorData = await response.json();

        alert(errorData.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      <div className="inline-block max-w-xl text-center justify-center px-4">
        <span className={title()}>Capture the&nbsp;</span>
        <span className={title({ color: "yellow" })}>Postman&nbsp;</span>
        <br />
        <div className="mt-4 text-default-500 text-sm">
          Welcome to the ultimate playground for API enthusiasts! Dive into a
          Capture the Flag adventure where you&apos;ll intercept requests,
          decode responses, and master Postman skills to climb the leaderboard.
        </div>
      </div>
      <Card className="w-full max-w-md mt-8">
        <CardBody className="overflow-hidden">
          {selected === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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

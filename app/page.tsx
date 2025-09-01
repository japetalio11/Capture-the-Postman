"use client";

import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Code } from "@heroui/code";
import {Select, SelectItem} from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { use, useState } from "react";
import { Snippet } from "@heroui/snippet";
import { useRouter } from 'next/navigation';

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { httpMethods } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [initialHttpMethod, setInitialHttpMethod] = useState("");
  const [httpMethod, setHttpMethod] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [secondHttpMethod, setSecondHttpMethod] = useState("");
  const [thirdHttpMethod, setThirdHttpMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [codeError, setCodeError] = useState("");
  const [initialHttpMethodError, setInitialHttpMethodError] = useState("");
  const [httpMethodError, setHttpMethodError] = useState("");
  const [secondHttpMethodError, setSecondHttpMethodError] = useState("");
  const [thirdHttpMethodError, setThirdHttpMethodError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { 
    isOpen: isSecondModalOpen, 
    onOpen: onSecondModalOpen, 
    onOpenChange: onSecondModalOpenChange 
  } = useDisclosure();
  const { 
    isOpen: isThirdModalOpen, 
    onOpen: onThirdModalOpen, 
    onOpenChange: onThirdModalOpenChange 
  } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitialHttpMethodError("");
    
    if (initialHttpMethod !== "POST") {
      setInitialHttpMethodError("Invalid HTTP method. Please select the correct method for creating data.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("https://fordemo-ot4j.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sign up successful:", data);
        setSuccessData(data);
        onOpen();
      } else {
        console.error("Sign up failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setHttpMethodError("");
    
    if (httpMethod !== "GET") {
      setHttpMethodError("Invalid HTTP method. Please select the correct method for fetching data.");
      return;
    }
    
    if (code !== successData?.code) {
      setCodeError("Invalid code. Please enter the correct 6-character code.");
      return;
    }

    setIsFetching(true);
    
    try {
      const response = await fetch(`https://fordemo-ot4j.onrender.com/users/${successData.code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetch successful:", data);
        setFetchedData(data);
        onOpenChange(false);
        onSecondModalOpen();
      } else {
        console.error("Fetch failed:", response.status, response.statusText);
        setCodeError("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setCodeError("Network error occurred. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecondHttpMethodError("");
    setUserIdError("");
    
    if (secondHttpMethod !== "PATCH") {
      setSecondHttpMethodError("Invalid HTTP method. Please select the correct method for partially updating data.");
      return;
    }
    
    if (userId !== fetchedData?.id) {
      setUserIdError("Invalid ID. Please enter the correct ID.");
      return;
    }

    setIsUpdating(true);
    
    try {
      const response = await fetch(`https://fordemo-ot4j.onrender.com/users/${fetchedData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Update successful:", data);
        setUpdatedData(data);
        onSecondModalOpenChange(false);
        onThirdModalOpen();
      } else {
        console.error("Update failed:", response.status, response.statusText);
        setUserIdError("Failed to update data. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setUserIdError("Network error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRedirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setThirdHttpMethodError("");
    
    if (thirdHttpMethod !== "GET") {
      setThirdHttpMethodError("Invalid HTTP method. Please select the correct method for fetching data.");
      return;
    }

    setIsRedirecting(true);

    try {
      onThirdModalOpenChange(false);
      
      router.push('/users');
      
    } catch (error) {
      console.error("Redirect error:", error);
      setThirdHttpMethodError("Navigation error occurred. Please try again.");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Capture the&nbsp;</span>
        <span className={title({ color: "yellow" })}>Postman&nbsp;</span>
        <br />
        <div className="mt-4 text-default-500 text-sm">
          Create new user data with the parameter <Code>username</Code> (your surname) and a <Code>password</Code> (a fictional password) 
          using <Code>/users</Code> as an endpoint to get the answer for number 1.
        </div>
      </div>

      <Card className="w-full max-w-md mt-8">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Select 
              className="max-w" 
              label="HTTP Method" 
              placeholder="Select the correct HTTP method"
              selectedKeys={initialHttpMethod ? [initialHttpMethod] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setInitialHttpMethod(selectedKey);
                setInitialHttpMethodError("");
              }}
              isInvalid={!!initialHttpMethodError}
              errorMessage={initialHttpMethodError}
              isRequired
            >
                {httpMethods.map((httpMethod) => (
                <SelectItem key={httpMethod.key}>{httpMethod.label}</SelectItem>
                ))}
            </Select>
            <Input
              type="text"
              label="Username"
              placeholder="Enter your surname"
              value={username}
              onValueChange={setUsername}
              isRequired
              variant="bordered"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              isRequired
              variant="bordered"
            />
            <Button
              type="submit"
              color="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Data..." : "Sign Up"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
            <ModalHeader className="flex flex-col gap-1">
                You got it! 👍
              </ModalHeader>
              <ModalBody className="p-6">
                {successData && (
                  <div>
                    <p className="text-sm">
                      {successData.message}
                    </p>
                    <p className="mt-8">
                    <Code>"code"</Code>: {successData.code}
                    </p>
                    <p className="mt-4">
                    <Code>"id"</Code>: {successData.id}
                    </p>
                  </div>
                )}

                <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4 mt-8">
                    <Select 
                      className="max-w" 
                      label="HTTP Method" 
                      placeholder="Select the correct HTTP method"
                      selectedKeys={httpMethod ? [httpMethod] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setHttpMethod(selectedKey);
                        setHttpMethodError("");
                      }}
                      isInvalid={!!httpMethodError}
                      errorMessage={httpMethodError}
                    >
                        {httpMethods.map((httpMethod) => (
                        <SelectItem key={httpMethod.key}>{httpMethod.label}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        type="text"
                        label="Code"
                        placeholder="Enter the 6 random characters"
                        value={code}
                        onValueChange={(value) => {
                          setCode(value);
                          setCodeError("");
                        }}
                        isRequired
                        variant="bordered"
                        isInvalid={!!codeError}
                        errorMessage={codeError}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        size="md"
                        isLoading={isFetching}
                        className="w-full"
                        >
                        {isFetching ? "Fetching Data..." : "Fetch"}
                    </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isSecondModalOpen} onOpenChange={onSecondModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                You're starting out! 🌱
              </ModalHeader>
              <ModalBody className="p-6">
                {fetchedData && (
                  <div>
                    <p className="text-sm">
                      {fetchedData.message}
                    </p>
                    <p className="mt-8">
                    <Code>"id"</Code>: {fetchedData.id}
                    </p>
                  </div>
                )}

                <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4 mt-8">
                    <Select 
                      className="max-w" 
                      label="HTTP Method" 
                      placeholder="Select the correct HTTP method"
                      selectedKeys={secondHttpMethod ? [secondHttpMethod] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setSecondHttpMethod(selectedKey);
                        setSecondHttpMethodError("");
                      }}
                      isInvalid={!!secondHttpMethodError}
                      errorMessage={secondHttpMethodError}
                    >
                        {httpMethods.map((httpMethod) => (
                        <SelectItem key={httpMethod.key}>{httpMethod.label}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        type="text"
                        label="Username"
                        placeholder="Enter new username"
                        value={newUsername}
                        onValueChange={(value) => {
                          setNewUsername(value);
                        }}
                        isRequired
                        variant="bordered"
                    />
                    <Input
                        type="text"
                        label="Id"
                        placeholder="Enter the id"
                        value={userId}
                        onValueChange={(value) => {
                          setUserId(value);
                          setUserIdError("");
                        }}
                        isRequired
                        variant="bordered"
                        isInvalid={!!userIdError}
                        errorMessage={userIdError}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        size="md"
                        isLoading={isUpdating}
                        className="w-full"
                        >
                        {isUpdating ? "Partially Updating Data..." : "Update"}
                    </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isThirdModalOpen} onOpenChange={onThirdModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                You are almost there! 😊
              </ModalHeader>
              <ModalBody className="p-6">
                {updatedData && (
                  <div>
                    <p className="text-sm">
                      {updatedData.message}
                    </p>
                  </div>
                )}
                <form onSubmit={handleRedirectSubmit} className="flex flex-col gap-4 mt-8">
                    <Select 
                        className="max-w" 
                        label="HTTP Method" 
                        placeholder="Select the correct HTTP method"
                        selectedKeys={thirdHttpMethod ? [thirdHttpMethod] : []}
                        onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setThirdHttpMethod(selectedKey);
                        setThirdHttpMethodError("");
                        }}
                        isRequired
                        isInvalid={!!thirdHttpMethodError}
                        errorMessage={thirdHttpMethodError}
                    >
                        {httpMethods.map((httpMethod) => (
                        <SelectItem key={httpMethod.key}>{httpMethod.label}</SelectItem>
                        ))}
                    </Select>
                    <Button
                        type="submit"
                        color="primary"
                        size="md"
                        isLoading={isRedirecting}
                        className="w-full"
                        >
                        {isRedirecting ? "Fetching Users..." : "Fetch"}
                    </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
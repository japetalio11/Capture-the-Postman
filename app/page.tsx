"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Code } from "@heroui/code";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { httpMethods } from "@/lib/constants";

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
    onOpenChange: onSecondModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isThirdModalOpen,
    onOpen: onThirdModalOpen,
    onOpenChange: onThirdModalOpenChange,
  } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitialHttpMethodError("");

    if (initialHttpMethod !== "POST") {
      setInitialHttpMethodError(
        "Invalid HTTP method. Please select the correct method for creating data.",
      );

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
      setHttpMethodError(
        "Invalid HTTP method. Please select the correct method for fetching data.",
      );

      return;
    }

    if (code !== successData?.code) {
      setCodeError("Invalid code. Please enter the correct 6-character code.");

      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch(
        `https://fordemo-ot4j.onrender.com/users/${successData.code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
      setSecondHttpMethodError(
        "Invalid HTTP method. Please select the correct method for partially updating data.",
      );

      return;
    }

    if (userId !== fetchedData?.id) {
      setUserIdError("Invalid ID. Please enter the correct ID.");

      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `https://fordemo-ot4j.onrender.com/users/${fetchedData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUsername,
          }),
        },
      );

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
      setThirdHttpMethodError(
        "Invalid HTTP method. Please select the correct method for fetching data.",
      );

      return;
    }

    setIsRedirecting(true);

    try {
      onThirdModalOpenChange(false);

      router.push("/users");
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
          Create new user data with the parameter <Code>username</Code> (your
          surname) and a <Code>password</Code> (a fictional password) using{" "}
          <Code>/users</Code> as an endpoint to get the answer for number 1.
        </div>
      </div>

      <Card className="w-full max-w-md mt-8">
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Select
              isRequired
              className="max-w"
              errorMessage={initialHttpMethodError}
              isInvalid={!!initialHttpMethodError}
              label="HTTP Method"
              placeholder="Select the correct HTTP method"
              selectedKeys={initialHttpMethod ? [initialHttpMethod] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;

                setInitialHttpMethod(selectedKey);
                setInitialHttpMethodError("");
              }}
            >
              {httpMethods.map((httpMethod) => (
                <SelectItem key={httpMethod.key}>{httpMethod.label}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              label="Username"
              placeholder="Enter your surname"
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
            <Button
              className="w-full"
              color="primary"
              isLoading={isLoading}
              size="md"
              type="submit"
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
                    <p className="text-sm">{successData.message}</p>
                    <p className="mt-8">
                      <Code>"code"</Code>: {successData.code}
                    </p>
                    <p className="mt-4">
                      <Code>"id"</Code>: {successData.id}
                    </p>
                  </div>
                )}

                <form
                  className="flex flex-col gap-4 mt-8"
                  onSubmit={handleCodeSubmit}
                >
                  <Select
                    className="max-w"
                    errorMessage={httpMethodError}
                    isInvalid={!!httpMethodError}
                    label="HTTP Method"
                    placeholder="Select the correct HTTP method"
                    selectedKeys={httpMethod ? [httpMethod] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      setHttpMethod(selectedKey);
                      setHttpMethodError("");
                    }}
                  >
                    {httpMethods.map((httpMethod) => (
                      <SelectItem key={httpMethod.key}>
                        {httpMethod.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    isRequired
                    errorMessage={codeError}
                    isInvalid={!!codeError}
                    label="Code"
                    placeholder="Enter the 6 random characters"
                    type="text"
                    value={code}
                    variant="bordered"
                    onValueChange={(value) => {
                      setCode(value);
                      setCodeError("");
                    }}
                  />
                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={isFetching}
                    size="md"
                    type="submit"
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
                    <p className="text-sm">{fetchedData.message}</p>
                    <p className="mt-8">
                      <Code>"id"</Code>: {fetchedData.id}
                    </p>
                  </div>
                )}

                <form
                  className="flex flex-col gap-4 mt-8"
                  onSubmit={handleUpdateSubmit}
                >
                  <Select
                    className="max-w"
                    errorMessage={secondHttpMethodError}
                    isInvalid={!!secondHttpMethodError}
                    label="HTTP Method"
                    placeholder="Select the correct HTTP method"
                    selectedKeys={secondHttpMethod ? [secondHttpMethod] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      setSecondHttpMethod(selectedKey);
                      setSecondHttpMethodError("");
                    }}
                  >
                    {httpMethods.map((httpMethod) => (
                      <SelectItem key={httpMethod.key}>
                        {httpMethod.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    isRequired
                    label="Username"
                    placeholder="Enter new username"
                    type="text"
                    value={newUsername}
                    variant="bordered"
                    onValueChange={(value) => {
                      setNewUsername(value);
                    }}
                  />
                  <Input
                    isRequired
                    errorMessage={userIdError}
                    isInvalid={!!userIdError}
                    label="Id"
                    placeholder="Enter the id"
                    type="text"
                    value={userId}
                    variant="bordered"
                    onValueChange={(value) => {
                      setUserId(value);
                      setUserIdError("");
                    }}
                  />
                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={isUpdating}
                    size="md"
                    type="submit"
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
                    <p className="text-sm">{updatedData.message}</p>
                  </div>
                )}
                <form
                  className="flex flex-col gap-4 mt-8"
                  onSubmit={handleRedirectSubmit}
                >
                  <Select
                    isRequired
                    className="max-w"
                    errorMessage={thirdHttpMethodError}
                    isInvalid={!!thirdHttpMethodError}
                    label="HTTP Method"
                    placeholder="Select the correct HTTP method"
                    selectedKeys={thirdHttpMethod ? [thirdHttpMethod] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      setThirdHttpMethod(selectedKey);
                      setThirdHttpMethodError("");
                    }}
                  >
                    {httpMethods.map((httpMethod) => (
                      <SelectItem key={httpMethod.key}>
                        {httpMethod.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={isRedirecting}
                    size="md"
                    type="submit"
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

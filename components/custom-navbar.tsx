"use client";

import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const CustomNavbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth cookie and redirect
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    router.refresh();
  };

  return (
    <Navbar maxWidth="full" position="static" className="bg-background">
      {/* Left Content: Spacer to balance layout */}
      <NavbarContent justify="start" className="hidden sm:flex" />

      {/* Center Content: Navigation Tabs */}
      <NavbarContent justify="center">
        <div className="flex bg-default-100 p-1 rounded-lg gap-1">
          <Button
            as={NextLink}
            href="/test"
            size="sm"
            color={pathname === "/test" ? "primary" : "default"}
            variant={pathname === "/test" ? "solid" : "light"}
            className="min-w-[120px]"
          >
            Capture
          </Button>
          <Button
            as={NextLink}
            href="/leaderboard"
            size="sm"
            color={pathname === "/leaderboard" ? "primary" : "default"}
            variant={pathname === "/leaderboard" ? "solid" : "light"}
            className="min-w-[120px]"
          >
            Leaderboard
          </Button>
        </div>
      </NavbarContent>

      {/* Right Content: Edit Account & Logout */}
      <NavbarContent justify="end">
        {/*<NavbarItem>
          <Button color="primary" variant="flat" onPress={onOpen}>
            Edit Account
          </Button>
        </NavbarItem>*/}
        <NavbarItem>
          <Button color="danger" variant="flat" onPress={handleLogout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Edit Account Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Account
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full bg-default-200 flex items-center justify-center overflow-hidden border-2 border-primary">
                      {/* Placeholder for Profile Picture */}
                      <svg
                        className="w-12 h-12 text-default-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <Button size="sm" variant="bordered">
                      Change Profile Picture
                    </Button>
                  </div>

                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    variant="bordered"
                  />
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    variant="bordered"
                  />
                  <Input
                    label="Password"
                    placeholder="Enter new password"
                    type="password"
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Profile
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Navbar>
  );
};

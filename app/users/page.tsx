"use client";

import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@heroui/table";
import { Chip, ChipProps } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { title } from "@/components/primitives";
import { Pagination } from "@heroui/pagination";
import { httpMethods } from '@/lib/constants';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure 
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

interface User {
  _id: string;
  username: string;
  code: string;
  __v: number;
  number5: string;
}

interface ApiResponse {
  message: string;
  users: User[];
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  inactive: "danger",
  pending: "warning",
};

const columns = [
  { name: "ID", uid: "_id" },
  { name: "USERNAME", uid: "username" },
  { name: "CODE", uid: "code" },
  { name: "NUMBER5", uid: "number5" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const {
    isOpen: isDeleteModalOpen, 
    onOpen: onDeleteModalOpen, 
    onOpenChange: onDeleteModalOpenChange
  } = useDisclosure();
  const [deleteHttpMethod, setDeleteHttpMethod] = useState("");
  const [deleteUserId, setDeleteUserId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://fordemo-ot4j.onrender.com/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log("Fetched users:", data);
      
      if (data.message && Array.isArray(data.users)) {
        setUsers(data.users);
        setApiMessage(data.message);
      } else {
        console.warn("Unexpected data format:", data);
        setUsers([]);
        setApiMessage("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");

    if (deleteHttpMethod !== "DELETE") {
      setDeleteError("Invalid HTTP method");
      return;
    }

    if (!deleteUserId) {
      setDeleteError("Please enter a user ID.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://fordemo-ot4j.onrender.com/users/${deleteUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        onDeleteModalOpenChange(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setDeleteError(`Failed to delete user: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteError("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteUserId("");
      setDeleteHttpMethod("");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pages = Math.ceil(users.length / rowsPerPage);

  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  const renderCell = (user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "_id":
        return (
          <div className="flex items-center gap-2">
            <span className="text-small font-mono">{user._id}</span>
          </div>
        );
      case "username":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.username}</p>
          </div>
        );
      case "code":
        return (
          <div className="flex items-center">
            <Chip className="capitalize font-mono text-xs" color="primary" size="sm" variant="flat">
              {user.code}
            </Chip>
          </div>
        );
      case "number5":
        return (
          <div className="flex items-center">
            <Chip className="capitalize font-mono text-xs" color="secondary" size="sm" variant="flat">
              {user.number5}
            </Chip>
          </div>
        );
      default:
        return cellValue?.toString() || "N/A";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <h1 className={title({ color: "red" })}>Error</h1>
          <p className="text-default-500 mt-2">{error}</p>
        </div>
        <Button color="primary" onPress={fetchUsers}>
          Retry
        </Button>
        <Link href="/">
          <Button color="default" variant="bordered">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={title()}>Well done! ✨</span>
          <div className="flex gap-2">
            <Button 
              color="danger" 
              variant="flat" 
              onPress={onDeleteModalOpen}
            >
              Delete
            </Button>
            <Link href="/">
              <Button color="default" variant="bordered">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-default-500 text-sm">
          {apiMessage}
        </p>
      </div>

        <Table 
        aria-label="Users table"
        >
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn
                key={column.uid}
                align={"start"}
            >
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        <TableBody
            items={paginatedUsers}
            isLoading={loading}
            loadingContent={<Spinner label="Loading users..." />}
            emptyContent={
            <div className="flex flex-col items-center gap-2 py-8">
                <p className="text-default-500">No users found</p>
            </div>
            }
        >
            {(user) => (
            <TableRow key={user._id}>
                {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
                )}
            </TableRow>
            )}
        </TableBody>
        </Table>

        <div className="flex w-full justify-end">
            <Pagination
                isCompact
                showControls
                showShadow
                color="default"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
            />
        </div>
        <Modal 
          isOpen={isDeleteModalOpen} 
          onOpenChange={onDeleteModalOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete User
                </ModalHeader>
                <ModalBody className="p-6">
                  <form onSubmit={handleDeleteSubmit} className="flex flex-col gap-4">
                    <Select 
                      label="HTTP Method" 
                      placeholder="Select the correct HTTP method"
                      selectedKeys={deleteHttpMethod ? [deleteHttpMethod] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setDeleteHttpMethod(selectedKey);
                        setDeleteError("");
                      }}
                      isRequired
                      isInvalid={!!deleteError}
                      errorMessage={deleteError}
                    >
                      {httpMethods.map((method) => (
                        <SelectItem key={method.key}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="User ID"
                      placeholder="Enter the user ID"
                      value={deleteUserId}
                      onValueChange={setDeleteUserId}
                      isRequired
                    />
                    <Button
                      type="submit"
                      color="danger"
                      isLoading={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  );
}
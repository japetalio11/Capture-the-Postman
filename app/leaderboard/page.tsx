"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { CustomNavbar } from "@/components/custom-navbar";

// Mock data sorted by score
const allUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `User ${i + 1}`,
  score: Math.floor(Math.random() * 10000) + 500,
  avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
})).sort((a, b) => b.score - a.score);

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(allUsers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return allUsers.slice(start, end);
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <div className="container mx-auto max-w-7xl pt-8 px-6 flex-grow">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Leaderboard</h1>

          <Table
            aria-label="Leaderboard table"
            bottomContent={
              <div className="flex w-full justify-center my-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>RANK</TableColumn>
              <TableColumn>USER</TableColumn>
              <TableColumn>SCORE</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => {
                // Calculate rank based on global index
                const rank = allUsers.indexOf(item) + 1;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-bold text-default-500">
                        #{rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-default-200 overflow-hidden border border-default-300">
                          <img
                            src={item.avatar}
                            alt={item.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{item.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{item.score.toLocaleString()}</span>
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

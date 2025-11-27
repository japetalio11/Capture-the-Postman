"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";

import { CustomNavbar } from "@/components/custom-navbar";
import { API_BASE_URL } from "@/lib/constants";

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

interface LeaderboardResponse {
  items: LeaderboardEntry[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/leaderboard/top?limit=100`,
        );

        if (response.ok) {
          const data: LeaderboardResponse = await response.json();

          setLeaderboard(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const pages = Math.ceil(leaderboard.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return leaderboard.slice(start, end);
  }, [page, leaderboard]);

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
            <TableBody
              emptyContent={"No leaderboard data found"}
              isLoading={loading}
              items={items}
              loadingContent={<Spinner label="Loading leaderboard..." />}
            >
              {(item) => {
                // Calculate rank based on global index
                const rank = leaderboard.indexOf(item) + 1;

                return (
                  <TableRow key={item.userId}>
                    <TableCell>
                      <span className="font-bold text-default-500">
                        #{rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-default-200 overflow-hidden border border-default-300 flex items-center justify-center">
                          <span className="text-lg font-bold text-default-500">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">
                        {item.score.toLocaleString()}
                      </span>
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

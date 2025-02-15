"use client";

import { RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { useTwilio } from "@/contexts/TwilioProvider";

interface CostDataResponse {
  totalCost: string;
  error?: string;
}

export const LiveCostCardCom = () => {
  const { twilioAccount } = useTwilio();
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the backend
  const fetchCostData = async () => {
    setLoading(true); // Set loading to true when starting fetch
    setError(null); // Reset error state on each fetch

    try {
      console.log(twilioAccount?.sid, twilioAccount?.authToken);
      const response = await fetch("/api/v1/dashboard/today-total-use", {
        method: "GET",
        headers: {
          "x-account-sid": twilioAccount?.sid || "",
          "x-auth-token": twilioAccount?.authToken || "",
          "Content-Type": "application/json", // Ensure proper content type
        },
      });

      const data: CostDataResponse = await response.json();

      if (response.ok) {
        setTotalCost(data.totalCost); // Update totalCost with fetched data
      } else {
        throw new Error(data.error || "Failed to fetch cost data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error fetching data");
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false); // Reset loading state when done
    }
  };

  // Fetch data on component mount and when 'loading' changes (e.g., when the button is clicked)
  useEffect(() => {
    fetchCostData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live Cost</CardTitle>
        <button
          onClick={() => {
            setLoading(true); // Set loading to true when the button is clicked
            fetchCostData(); // Fetch data on button click
          }}
        >
          <RefreshCcw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold">${totalCost}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

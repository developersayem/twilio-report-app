"use client";

import { RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useState, useEffect } from "react";
import { useTwilio } from "@/contexts/TwilioProvider";

interface CostDataResponse {
  totalCost: string;
  error?: string;
}

const LastWeekCostCardCom = () => {
  const { twilioAccount } = useTwilio();
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the backend
  const fetchCostData = async () => {
    setLoading(true);
    setError(null);

    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    try {
      const responses = await Promise.all(
        dates.map(async (date) => {
          const response = await fetch("/api/v1/dashboard/total-used", {
            method: "GET",
            headers: {
              "x-account-sid": twilioAccount?.sid || "",
              "x-auth-token": twilioAccount?.authToken || "",
              "x-date": date,
              "Content-Type": "application/json",
            },
          });

          const data: CostDataResponse = await response.json();
          return response.ok ? parseFloat(data.totalCost) || 0 : 0;
        })
      );

      const totalLastWeekCost = responses.reduce((sum, cost) => sum + cost, 0);
      setTotalCost(totalLastWeekCost.toFixed(2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error fetching data");
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when 'loading' changes (e.g., when the button is clicked)
  useEffect(() => {
    fetchCostData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          last 7 day&apos;s total cost
        </CardTitle>
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
            <div className="text-4xl font-bold">${totalCost}</div>
            <p className="text-xs text-muted-foreground">
              {/* +20.1% from last month */}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LastWeekCostCardCom;

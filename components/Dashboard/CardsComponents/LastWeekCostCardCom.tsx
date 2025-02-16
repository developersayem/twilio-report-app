"use client";

import { RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useState, useEffect } from "react";
import { useTwilio } from "@/contexts/TwilioProvider";

interface UsageData {
  date: string;
  smsCount: number;
  smsCost: number;
  callCount: number;
  callCost: number;
  totalCost: number;
  totalCallMinutes: number;
}

const LastWeekCostCardCom = () => {
  const { twilioAccount } = useTwilio();
  const [data, setData] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/dashboard/last-7-days-usages", {
        method: "GET",
        headers: {
          "x-account-sid": twilioAccount?.sid || "",
          "x-auth-token": twilioAccount?.authToken || "",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotals = () => {
    const totals = data.reduce(
      (acc, item) => {
        acc.smsCount += item.smsCount;
        acc.smsCost += item.smsCost;
        acc.callCount += item.callCount;
        acc.totalCallMinutes += item.totalCallMinutes;
        acc.callCost += item.callCost;
        acc.totalCost += item.totalCost;
        return acc;
      },
      {
        smsCount: 0,
        smsCost: 0,
        callCount: 0,
        totalCallMinutes: 0,
        callCost: 0,
        totalCost: 0,
      }
    );
    return totals;
  };

  const totals = calculateTotals();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          {` last ${data.length} day's total cost`}
        </CardTitle>
        <button
          onClick={() => {
            setLoading(true); // Set loading to true when the button is clicked
            fetchData(); // Fetch data on button click
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
            <div className="text-4xl font-bold">
              ${totals.totalCost.toFixed(2)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LastWeekCostCardCom;

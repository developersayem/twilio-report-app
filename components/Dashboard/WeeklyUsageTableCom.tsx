"use client";

import { useState, useEffect } from "react";
import { useTwilio } from "@/contexts/TwilioProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface UsageData {
  date: string;
  smsCount: number;
  smsCost: number;
  callCount: number;
  callCost: number;
  totalCost: number;
  totalCallMinutes: number;
}

const WeeklyUsageTableCom = () => {
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Twilio Usage");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelBlob, "Twilio_Usage.xlsx");
  };

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{`Twilio Usage (Last ${data.length} Days)`}</h2>
        <div className="flex gap-2">
          <Button onClick={fetchData} disabled={loading} variant="outline">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={exportToExcel} variant="default">
            <FileDown size={18} className="mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>SMS Count</TableHead>
              <TableHead>SMS Cost ($)</TableHead>
              <TableHead>Call Count</TableHead>
              <TableHead>Total Call Minutes</TableHead>
              <TableHead>Call Cost ($)</TableHead>
              <TableHead>Total Cost ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.date}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.smsCount}SMS</TableCell>
                <TableCell>${item.smsCost.toFixed(2)}</TableCell>
                <TableCell>{item.callCount} Calls</TableCell>
                <TableCell>
                  {item.totalCallMinutes.toFixed(2)} Minutes
                </TableCell>
                <TableCell>${item.callCost.toFixed(2)}</TableCell>
                <TableCell>${item.totalCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            <TableRow className="font-bold bg-gray-100 text-black hover:bg-gray-100 hover:text-black">
              <TableCell>Total</TableCell>
              <TableCell>{totals.smsCount} SMS</TableCell>
              <TableCell>${totals.smsCost.toFixed(2)}</TableCell>
              <TableCell>{totals.callCount} Calls</TableCell>
              <TableCell>
                {totals.totalCallMinutes.toFixed(2)} Minutes
              </TableCell>
              <TableCell>${totals.callCost.toFixed(2)}</TableCell>
              <TableCell>${totals.totalCost.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WeeklyUsageTableCom;

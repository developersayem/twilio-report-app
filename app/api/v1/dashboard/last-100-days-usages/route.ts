export const maxDuration = 30; // Function timeout limit

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function GET(req: NextRequest) {
  const accountSid = req.headers.get("x-account-sid") || "";
  const authToken = req.headers.get("x-auth-token") || "";

  if (!accountSid.startsWith("AC") || !authToken) {
    return NextResponse.json(
      { error: "Invalid or missing Twilio credentials" },
      { status: 400 }
    );
  }

  const client = twilio(accountSid, authToken);

  async function fetchUsageData(): Promise<
    {
      date: string;
      smsCount: number;
      smsCost: number;
      callCount: number;
      callCost: number;
      totalCost: number;
      totalCallMinutes: number;
    }[]
  > {
    const today = new Date();
    const usageRequests = [];

    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      const currentDate = new Date(formattedDate);

      usageRequests.push(
        client.usage.records.daily
          .list({
            startDate: currentDate,
            endDate: currentDate,
          })
          .then((records) => {
            let smsCount = 0;
            let callCount = 0;
            let smsCost = 0;
            let callCost = 0;
            let totalCost = 0;
            let totalCallMinutes = 0;

            records.forEach((record) => {
              const cost =
                typeof record.price === "number"
                  ? record.price
                  : parseFloat(record.price || "0");

              if (record.category.includes("sms")) {
                smsCount += parseInt(record.usage || "0", 10);
                smsCost += cost;
              }
              if (record.category.includes("calls")) {
                callCount += parseInt(record.usage || "0", 10);
                callCost += cost;
                totalCallMinutes += parseInt(record.usage || "0", 10) / 60; // Convert seconds to minutes
              }
              totalCost += cost;
            });
            return {
              date: formattedDate,
              smsCount,
              smsCost: parseFloat(smsCost.toFixed(2)),
              callCount,
              callCost: parseFloat(callCost.toFixed(2)),
              totalCost: parseFloat(totalCost.toFixed(2)),
              totalCallMinutes: parseFloat(totalCallMinutes.toFixed(2)),
            };
          })
          .catch((error) => {
            console.error(`Error fetching data for ${formattedDate}:`, error);
            return null; // Skip failed requests
          })
      );
    }

    const results = await Promise.all(usageRequests);
    return results.filter((entry) => entry !== null); // Remove failed requests
  }

  try {
    const usageRecords = await fetchUsageData();
    return NextResponse.json({ data: usageRecords });
  } catch (error) {
    console.error("Error fetching Twilio usage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

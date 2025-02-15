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
      totalCallMinutes: number; // Add total call minutes
    }[]
  > {
    const today = new Date();
    const usageData: {
      date: string;
      smsCount: number;
      smsCost: number;
      callCount: number;
      callCost: number;
      totalCost: number;
      totalCallMinutes: number;
    }[] = [];

    try {
      for (let i = 0; i < 100; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0];

        const fixedDate = new Date(formattedDate);

        const records = await client.usage.records.daily.list({
          startDate: fixedDate,
          endDate: fixedDate,
        });

        let smsCount = 0;
        let callCount = 0;
        let smsCost = 0;
        let callCost = 0;
        let totalCost = 0;
        let totalCallMinutes = 0; // Initialize total call minutes

        records.forEach((record) => {
          const cost =
            typeof record.price === "number"
              ? record.price
              : parseFloat(record.price || "0");

          if (record.category.includes("sms")) {
            smsCount += record.usage ? parseInt(record.usage, 10) : 0;
            smsCost += cost;
          }
          if (record.category.includes("calls")) {
            callCount += record.usage ? parseInt(record.usage, 10) : 0;
            callCost += cost;

            // Add call duration (convert from seconds to minutes)
            const callDuration = record.usage ? parseInt(record.usage, 10) : 0;
            totalCallMinutes += callDuration / 60; // Convert seconds to minutes
          }
          totalCost += cost;
        });

        usageData.push({
          date: formattedDate,
          smsCount,
          smsCost: parseFloat(smsCost.toFixed(2)),
          callCount,
          callCost: parseFloat(callCost.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalCallMinutes: parseFloat(totalCallMinutes.toFixed(2)), // Round to 2 decimals
        });
      }
    } catch (error) {
      console.error("Error fetching Twilio usage data:", error);
    }

    return usageData;
  }

  const usageRecords = await fetchUsageData();

  return NextResponse.json({
    data: usageRecords,
  });
}

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function GET(req: NextRequest) {
  const accountSid = req.headers.get("x-account-sid") || "";
  const authToken = req.headers.get("x-auth-token") || "";
  const date = req.headers.get("x-date"); // Extract the date from the header


  if (!accountSid.startsWith("AC") || !authToken) {
    return NextResponse.json(
      { error: "Invalid or missing Twilio credentials" },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: "Missing date in the request headers" },
      { status: 400 }
    );
  }

  const client = twilio(accountSid, authToken);

  async function fetchDailyCostReport(date: string): Promise<number> {
    let totalCost = 0;

    try {
      const formattedDate = new Date(date); // Use the date from the header

      const records = await client.usage.records.daily.list({
        startDate: formattedDate,
        endDate: formattedDate,
      });

      totalCost = records.reduce(
        (sum, record) =>
          sum +
          (typeof record.price === "number"
            ? record.price
            : parseFloat(record.price || "0")),
        0
      );
    } catch (error) {
      console.error("Error fetching usage records:", error);
    }

    return totalCost;
  }

  // Use the date from the header as the date to query
  const totalCost = await fetchDailyCostReport(date);

  return NextResponse.json({
    date: date,
    totalCost: totalCost.toFixed(2),
  });
}

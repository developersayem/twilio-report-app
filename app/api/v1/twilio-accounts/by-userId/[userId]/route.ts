import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/mongodb";
import { TwilioAccountsModel } from "@/app/models/twilioAccountModel";

// Handle GET request to fetch accounts by user ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect(); // Ensure database connection
    const userId = (await params).userId;
    const accounts = await TwilioAccountsModel.find({ user: userId }).lean(); // Fetch accounts by userId
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Database error", error },
      { status: 500 }
    );
  }
}

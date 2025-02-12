import { NextRequest, NextResponse } from "next/server";
import { Document } from "mongoose";
import dbConnect from "../utils/mongodb";
import ITwilioAccount from "@/interfaces/ITwilioAccount";
import { TwilioAccountsModel } from "@/app/models/twilioAccountModel";

// Define the POST handler for creating a new user
export async function POST(req: NextRequest) {
  await dbConnect();

  const { user, name, sid, authToken } = await req.json();

  // Ensure password is provided
  if (!name && !sid && !authToken) {
    return NextResponse.json(
      { message: "Account information are required!" },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingAccount = await TwilioAccountsModel.findOne({
      name,
    }).lean<ITwilioAccount>();
    if (existingAccount) {
      return NextResponse.json(
        { message: "Account already exists" },
        { status: 400 }
      );
    }
    // Create new user
    const newUser = (await TwilioAccountsModel.create({
      user,
      name,
      sid,
      authToken,
    })) as ITwilioAccount & Document;
    // Ensure proper typing by explicitly typing as IUser & Document
    const Account = newUser.toObject() as ITwilioAccount;
    // Convert _id to string explicitly
    return NextResponse.json({ message: "Account save successfully", Account });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

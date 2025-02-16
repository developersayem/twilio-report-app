import { NextRequest, NextResponse } from "next/server";
import { TwilioAccountsModel } from "@/app/models/twilioAccountModel";
import dbConnect from "../../utils/mongodb";

// Handle DELETE request to delete a Twilio account by ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      await dbConnect(); // Ensure database connection
      const { id } = await params;
      
      const deletedAccount = await TwilioAccountsModel.findByIdAndDelete(id);
      if (!deletedAccount) {
        return NextResponse.json(
          { message: "Account not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Account successfully deleted" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Error deleting account", error },
        { status: 500 }
      );
    }
  }
  
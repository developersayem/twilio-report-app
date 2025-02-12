import { Document } from "mongoose";

export default interface ITwilioAccount extends Document {
  name: string;
  sid: string;
  authToken: string;
  user: string;
  usages: string;
}

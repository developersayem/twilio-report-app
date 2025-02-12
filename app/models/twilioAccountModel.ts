import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import IUser from "@/interfaces/IUser";
import ITwilioAccount from "@/interfaces/ITwilioAccount";

// User Schema
const TwilioAccountsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    sid: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensures every task is linked to a user
    },
    usages: {
      type: Schema.Types.ObjectId,
      ref: "usages",
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// User Validator Function
const twilioAccValidator = (data: IUser) => {
  const twilioAccJoiSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(100).required(),
    sid: Joi.string().alphanum().required(),
    authToken: Joi.string().alphanum().required(),
  }).messages({
    "string.email": "Make sure your sid and auth token is correct",
  });

  const { error } = twilioAccJoiSchema.validate(data);
  return error;
};

// Check if the model is already defined
const TwilioAccountsModel =
  mongoose.models.TwilioAccounts ||
  mongoose.model<ITwilioAccount>("TwilioAccounts", TwilioAccountsSchema);

// Export Model and Validator
export { TwilioAccountsModel, twilioAccValidator };

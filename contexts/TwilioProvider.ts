"use client";
import React from "react";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export default interface ITwilioAccount {
  _id: string;
  name: string;
  sid: string;
  authToken: string;
  user: string;
  usages: string;
}

// Define the context type
interface TwilioContextType {
  twilioAccount: ITwilioAccount | null;
  setTwilioAccount: (accountData: ITwilioAccount) => void;
  clearTwilioAccount: () => void;
}

// Create the context
const TwilioContext = createContext<TwilioContextType | undefined>(undefined);

// TwilioProvider component to wrap app and provide context
export function TwilioProvider({ children }: { children: ReactNode }) {
  const [twilioAccount, setTwilioAccountState] =
    useState<ITwilioAccount | null>(null);

  useEffect(() => {
    const storedTwilioAccount = localStorage.getItem("twilioAccount");
    if (storedTwilioAccount) {
      setTwilioAccountState(JSON.parse(storedTwilioAccount));
    }
  }, []);

  const setTwilioAccount = (accountData: ITwilioAccount) => {
    setTwilioAccountState(accountData);
    localStorage.setItem("twilioAccount", JSON.stringify(accountData));
  };

  const clearTwilioAccount = () => {
    setTwilioAccountState(null);
    localStorage.removeItem("twilioAccount");
  };

  return React.createElement(
    TwilioContext.Provider,
    { value: { twilioAccount, setTwilioAccount, clearTwilioAccount } },
    children
  );
}

// Custom hook to access the Twilio context
export function useTwilio() {
  const context = useContext(TwilioContext);
  if (!context) {
    throw new Error("useTwilio must be used within a TwilioProvider");
  }
  return context;
}

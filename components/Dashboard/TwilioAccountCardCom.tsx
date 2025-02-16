import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { useTwilio } from "@/contexts/TwilioProvider";
import ITwilioAccount from "@/interfaces/ITwilioAccount";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

export default function TwilioAccountCardCom() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ITwilioAccount[]>([]);
  const { twilioAccount, reFetchData, setReFetchData } = useTwilio();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch(
          `/api/v1/twilio-accounts/by-userId/${user?._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        setAccounts(data);
      } catch (error) {
        toast.error("Failed to fetch accounts");
        console.error("Error fetching accounts:", error);
      }
    }
    fetchAccounts();
  }, [user]);

  async function handleDelete(accountId: string) {
    try {
      const res = await fetch(`/api/v1/twilio-accounts/${accountId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      setAccounts(accounts.filter((account) => account._id !== accountId));
      setReFetchData(!reFetchData);

      toast.success("Accounts Deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete accounts!");
      console.error("Error deleting account:", error);
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div
          key={account._id}
          className="p-4 bg-[#27272a] flex justify-between capitalize rounded-xl"
        >
          <h1>{account.name}</h1>
          <div className="flex justify-end items-center gap-3">
            {twilioAccount?._id === account._id && (
              <CheckCircle className="text-primary" size={20} />
            )}
            <button
              className=" p-1 text-primary text-white rounded-full hover:text-red-600"
              onClick={() => handleDelete(account._id)}
              aria-label="Delete account"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

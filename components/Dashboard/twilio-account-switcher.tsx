"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthProvider";
import { useTwilio } from "@/contexts/TwilioProvider";

interface ITwilioAccount {
  _id: string;
  name: string;
  sid: string;
  authToken: string;
  user: string;
  usages: string;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function TwilioAccountSwitcher({
  className,
}: PopoverTriggerProps) {
  const { user } = useAuth();
  const { twilioAccount, setTwilioAccount } = useTwilio();
  const [open, setOpen] = useState(false);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ITwilioAccount | null>(
    twilioAccount || null
  );
  const [accounts, setAccounts] = useState<ITwilioAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAccount = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const accountData = {
        user,
        name: formData.get("name") as string,
        sid: formData.get("sid") as string,
        authToken: formData.get("authToken") as string,
      };

      const response = await fetch("/api/v1/twilio-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newAccount = await response.json();
      setAccounts((prev) => [...prev, newAccount]);
      setShowNewAccountDialog(false);
      setOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error("An error occurred while adding Twilio account:", error);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `/api/v1/twilio-accounts/by-userId/${user?._id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const plainAccounts = data.map(
          (account: ITwilioAccount & { toObject?: () => ITwilioAccount }) =>
            account.toObject ? account.toObject() : account
        );

        setAccounts(plainAccounts);

        // Check for localStorage and update selectedAccount
        const storedTwilioAccount = localStorage.getItem("twilioAccount");
        if (storedTwilioAccount) {
          const storedAccount = JSON.parse(storedTwilioAccount);
          setTwilioAccount(storedAccount);
          setSelectedAccount(storedAccount);
        } else if (plainAccounts.length > 0) {
          const firstAccount = plainAccounts[0];
          setTwilioAccount(firstAccount);
          setSelectedAccount(firstAccount);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching Twilio accounts:",
          error
        );
      }
    };
    fetchAccounts();
  }, [user?._id]);

  const handleAccountSelect = (account: ITwilioAccount) => {
    setSelectedAccount(account);
    setTwilioAccount(account);
    setOpen(false);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* <div className="mx-5">
        <h1>Twilio Account</h1>
      </div> */}
      <Dialog
        open={showNewAccountDialog}
        onOpenChange={setShowNewAccountDialog}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="min-w-[150px]">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a Twilio Account"
              className={cn("w-fit justify-between", className)}
            >
              <span className="capitalize truncate">
                {selectedAccount?.name || "Select Twilio account"}
              </span>
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[350px] p-0">
            <div className="w-full">
              <div className="flex flex-col">
                <div className="border-b p-2">
                  <Input
                    placeholder="Search account..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredAccounts.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No account found.
                    </div>
                  ) : (
                    filteredAccounts.map((account) => (
                      <Button
                        key={account._id}
                        variant="ghost"
                        className="w-full justify-between px-2 py-1.5"
                        onClick={() => handleAccountSelect(account)}
                      >
                        <span className="capitalize">{account.name}</span>
                        {selectedAccount?._id === account._id && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </Button>
                    ))
                  )}
                  <div className="border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5"
                      onClick={() => {
                        setShowNewAccountDialog(true);
                        setOpen(false);
                      }}
                    >
                      <PlusCircledIcon className="mr-2 h-5 w-5" />
                      Add New Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Twilio Account</DialogTitle>
            <DialogDescription>
              Add a new Twilio account to use later
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAccount}>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Twilio Account"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sid">Account SID</Label>
                <Input
                  id="sid"
                  name="sid"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authToken">Auth Token</Label>
                <Input
                  id="authToken"
                  name="authToken"
                  type="password"
                  placeholder="Enter your Twilio auth token"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewAccountDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

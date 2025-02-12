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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  const [open, setOpen] = useState(false);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ITwilioAccount | null>(
    null
  );
  console.log(selectedAccount);
  const [accounts, setAccounts] = useState<ITwilioAccount[]>([]);

  // SUBMIT NEW TWILIO ACCOUNT DATA TO DATABASE
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
      // Here you might want to show an error message to the user
    }
  };

  // Fetch Twilio accounts data
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
        setAccounts(data);
      } catch (error) {
        console.error(
          "An error occurred while fetching Twilio accounts:",
          error
        );
      }
    };
    fetchAccounts();
  }, []);

  const handleAccountSelect = (account: ITwilioAccount) => {
    setSelectedAccount(account);
    setOpen(false);
  };

  return (
    <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
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
              {selectedAccount?.name || "select twilio account"}
            </span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search account..." />
            <CommandList>
              <CommandEmpty>No account found.</CommandEmpty>
              <CommandGroup>
                {accounts.map((account) => (
                  <CommandItem
                    key={account._id}
                    onSelect={() => handleAccountSelect(account)}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{account.name}</span>
                    {selectedAccount?._id === account._id && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setShowNewAccountDialog(true);
                    setOpen(false);
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Add New Account
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
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
  );
}

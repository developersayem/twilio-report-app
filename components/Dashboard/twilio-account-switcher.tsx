// components/ShopSwitcher.js (Client Component)
"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Image {
  fileImage: string;
  fileName: string;
}
interface Shop {
  shopId: number;
  name: string;
  address: string;
  type: string;
  img: Image;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function TwilioAccountSwitcher({
  className,
}: PopoverTriggerProps) {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Shop>();
  const [selectedFile, setSelectedFile] = useState<Image | null>(null);
  const [shops, setShops] = useState<Shop[]>(); // Initialize state with server data

  // SUBMIT NEW SHOP DATA TO DATABASE
  const handleAddShop = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      const response = await fetch("/api/v1/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          address: (form.elements.namedItem("address") as HTMLInputElement)
            .value,
          type: (form.elements.namedItem("type") as HTMLInputElement).value,
          img: selectedFile,
        }),
      });

      if (response.ok) {
        await response.json(); // Assuming the API returns the newly added shop

        // Update the shops state
        fetchData();
        setShowNewTeamDialog(false);
        setOpen(false);
        setSelectedFile(null); // Reset selected file
        e.currentTarget.reset(); // Reset form fields
      } else {
      }
    } catch (error) {
      console.error("An error occurred while adding shop:", error);
    }
  };
  // how to get shops data
  const fetchData = async () => {
    try {
      const response = await fetch("/api/v1/shops");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error("An error occurred while fetching shops:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Shop"
            className={cn("w-[200px] justify-between", className)}
          >
            <span className="capitalize">
              {selectedAccount?.name || "chose an account"}
            </span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 ">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search account..." />
              <CommandEmpty>No account found.</CommandEmpty>
              {shops?.map((account: Shop) => (
                <Button
                  variant="ghost"
                  key={account._id}
                  onClick={() => {
                    setSelectedAccount(account);
                    console.log("Clicked");
                  }}
                  className="text-sm w-full"
                >
                  <span className="capitalize">{account.name}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAccount?.name === account.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </Button>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger className="w-full">
                  <CommandItem
                    onClick={() => {
                      setOpen(true);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    <span>Save Account</span>
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save New Account</DialogTitle>
          <DialogDescription>
            Save a new twilio account for Use later
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <form className="" action="" method="" onSubmit={handleAddShop}>
            <div className="space-y-2">
              <Label htmlFor="name" className="capitalize">
                name
              </Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sid" className="capitalize">
                SID
              </Label>
              <Input id="sid" placeholder="enter twilio account sid" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="capitalize">
                Auth Token
              </Label>
              <Input id="type" placeholder="Enter twilio account auth token" />
            </div>
            <DialogFooter className="py-5">
              <Button
                variant="outline"
                onClick={() => setShowNewTeamDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

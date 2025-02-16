"use client";

// import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Dashboard/tabs";
// import { CalendarDateRangePicker } from "@/components/Dashboard/date-range-picker";
// import { MainNav } from "@/components/Dashboard/main-nav";
import TwilioAccountSwitcher from "@/components/Dashboard/twilio-account-switcher";
import { UserNav } from "@/components/Dashboard/user-nav";
import { ThemeCom } from "@/components/ThemeCom/ThemeCom";
import { useAuth } from "@/contexts/AuthProvider";
import LiveCostCardCom from "@/components/Dashboard/CardsComponents/TodayCostCardCom";
import YesterdayCostCardCom from "@/components/Dashboard/CardsComponents/YesterdayCostCardCom";
import LastWeekCostCardCom from "@/components/Dashboard/CardsComponents/LastWeekCostCardCom";
import LastMonthCostCardCom from "@/components/Dashboard/CardsComponents/LastMonthCostCardCom";
import UsageTableCom from "@/components/Dashboard/UsageTableCom";
import WeeklyUsageTableCom from "@/components/Dashboard/WeeklyUsageTableCom";
import TwilioAccountCardCom from "@/components/Dashboard/TwilioAccountCardCom";
import LoginCardCom from "./(auth)/AuthComponents/LoginCardCom";

export default function DashboardPage() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  return (
    <>
      {user ? (
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="grid grid-cols-3 h-16 items-center px-4">
              {/* <MainNav className="mx-6" /> */}
              <TwilioAccountSwitcher />
              <div>{/* <h1>Twilio Usage&apos;s Reports</h1> */}</div>
              <div className="ml-auto flex items-center space-x-4">
                <ThemeCom />
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="monthly-reports">
                  Monthly Reports
                </TabsTrigger>
                <TabsTrigger value="twilio-accounts">
                  Twilio Accounts
                </TabsTrigger>
                <TabsTrigger value="notifications">Profile</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <LiveCostCardCom />
                  <YesterdayCostCardCom />
                  <LastWeekCostCardCom />
                  <LastMonthCostCardCom />
                </div>
                <div className="w-fll h-full">
                  <WeeklyUsageTableCom />
                </div>
              </TabsContent>
              <TabsContent value="monthly-reports" className="space-y-4">
                <div className="w-fll h-full">
                  <UsageTableCom />
                </div>
              </TabsContent>
              {/* Twilio Accounts Details */}
              <TabsContent value="twilio-accounts" className="space-y-4">
                <div className="w-fll h-full">
                  <TwilioAccountCardCom />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className="max-w-96">
            <LoginCardCom />
          </span>
        </div>
      )}
    </>
  );
}

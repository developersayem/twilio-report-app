"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Dashboard/tabs";
import { CalendarDateRangePicker } from "@/components/Dashboard/date-range-picker";
import { MainNav } from "@/components/Dashboard/main-nav";
import { Overview } from "@/components/Dashboard/overview";
import { RecentSales } from "@/components/Dashboard/recent-sales";
import TwilioAccountSwitcher from "@/components/Dashboard/twilio-account-switcher";
import { UserNav } from "@/components/Dashboard/user-nav";
import { ThemeCom } from "@/components/ThemeCom/ThemeCom";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import LiveCostCardCom from "@/components/Dashboard/TodayCostCardCom";
import YesterdayCostCardCom from "@/components/Dashboard/YesterdayCostCardCom";
import LastWeekCostCardCom from "@/components/Dashboard/LastWeekCostCardCom";
import LastMonthCostCardCom from "@/components/Dashboard/LastMonthCostCardCom";

export default function DashboardPage() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  return (
    <>
      {user ? (
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <TwilioAccountSwitcher />
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <ThemeCom />
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>Download</Button>
              </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" disabled>
                  Reports
                </TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <LiveCostCardCom />
                  <YesterdayCostCardCom />
                  <LastWeekCostCardCom />
                  <LastMonthCostCardCom />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        You made 265 sales this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex justify-center items-center">
          Please log in to see your data.
          <Link href="/login" className="underline text-blue-500 px-1">
            Log in
          </Link>
        </div>
      )}
    </>
  );
}

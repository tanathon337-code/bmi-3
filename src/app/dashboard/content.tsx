"use client";
import { useState, useEffect } from "react";
import BMIForm from "@/components/BMIForm";
import BMIHistory from "@/components/BMIHistory";
import BMIChart from "@/components/BMIChart";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  result: string;
  date: string;
}

export default function DashboardContent({ user }: { user: any }) {
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch("/api/bmi")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setRecords(data);
        } else {
            console.error("Failed to fetch records", data);
        }
      })
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hello, {user.name}</h1>
        <div className="space-x-4">
          <Link 
            href="/dashboard/reports" 
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            View MIS Reports
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="text-sm text-red-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
           <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Current Status</h2>
              {records.length > 0 ? (
                <div className="mt-2">
                   <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{records[0].bmi}</p>
                   <p className="text-lg text-blue-800 dark:text-blue-200">{records[0].result}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No data yet.</p>
              )}
           </div>
        </div>

        <div>
           <BMIForm onRecordAdded={() => setRefreshTrigger((prev) => prev + 1)} />
        </div>
        
        <div>
           {/* Placeholder for stats or another chart if needed, currently using full width for chart below */}
           <div className="h-full rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Stats</h3>
             <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
               <li>Total Records: {records.length}</li>
               <li>Latest Weight: {records[0]?.weight} kg</li>
             </ul>
           </div>
        </div>

        <div className="md:col-span-2">
          <BMIChart records={records} />
        </div>

        <div className="md:col-span-2">
          <BMIHistory records={records} />
        </div>
      </div>
    </div>
  );
}

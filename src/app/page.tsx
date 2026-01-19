import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          BMI Tracker
        </h1>
        <p className="max-w-md text-lg text-gray-600 dark:text-gray-400">
          Track your Body Mass Index over time and stay healthy.
        </p>
        
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-900 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-800"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">GitLancer Dashboard</h1>
      
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-2xl">
        {session ? (
          <div className="space-y-4">
            <h2 className="text-xl">Welcome back, <span className="text-purple-400">@{session.user?.name}</span></h2>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Active Bounties</p>
              <p className="text-lg">You have 0 pending claims.</p>
            </div>
            <Link href="/link" className="block text-center bg-purple-600 py-3 rounded-xl font-bold hover:bg-purple-700 transition">
              Manage Linked Wallet
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-slate-400 text-lg">Connect your GitHub to start earning USDC for your contributions.</p>
            <Link href="/link" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-bold">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
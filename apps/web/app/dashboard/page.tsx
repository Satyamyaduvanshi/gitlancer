import CreateVault from '../../components/CreateVault';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            SOLUX Maintainer Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your repository vaults and track AI-audited bounties.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Create New Vault */}
          <div>
            <CreateVault />
          </div>

          {/* Section 2: Stats/Info (Placeholder for now) */}
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Vault Security</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every vault you create is a unique <strong>PDA (Program Derived Address)</strong> on the Solana blockchain. Only your specific NestJS Oracle can authorize payouts, ensuring your USDC is safe until a PR is merged and audited.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-500/30">
                Devnet Active
              </span>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-500/30">
                AI Audit Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
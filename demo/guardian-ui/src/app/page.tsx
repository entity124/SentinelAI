import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
      {/* Hero Section */}
      <div className="max-w-3xl">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-[#00ff88]">GuardianAI</span>
          <br />
          <span className="text-[#E0E0E0]">Financial Firewall</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-[#aaa] mb-8">
          Detects predatory subscriptions for banks
        </p>

        {/* Problem Blurb */}
        <p className="text-base text-[#888] max-w-xl mx-auto leading-relaxed mb-24">
          Banks lose customers to hidden fees and predatory subscription traps.
          GuardianAI uses machine learning to identify and flag suspicious recurring
          charges before they drain your customers&apos; accounts.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center" style={{ marginTop: "25px" }}>
          <Link href="/dashboard">
            <button className="btn-accent">
              Enter Demo Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)"
        }}
      />
    </div>
  );
}

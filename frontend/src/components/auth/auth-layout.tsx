import { LayoutGrid, Star, TrendingUp, Verified, Zap } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light flex flex-col font-sans text-text-main relative overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, rgba(229, 231, 235, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1px, transparent 1px)",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
        }}
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl shadow-black/5 border border-border-subtle overflow-hidden">
          
          <div className="flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-10">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <LayoutGrid size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight text-text-main">Flowly</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">{title}</h1>
              <p className="text-text-muted text-sm font-medium">{subtitle}</p>
            </div>

            {children}
          </div>

          <div className="hidden md:flex md:w-80 bg-gray-50 border-l border-border-subtle flex-col justify-between p-8 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-text-main mb-4">Trusted by modern teams</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 mb-2 text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">
                    "Flowly has completely transformed how we track engineering sprints. The clarity is unmatched."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gray-200 overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-main">Sarah Jenkins</span>
                      <span className="text-[9px] text-text-muted">CTO, TechSpace</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Active Users</p>
                    <p className="text-lg font-bold text-text-main">12,000+</p>
                  </div>
                  <div className="size-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-8 space-y-2">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Verified size={16} />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Zap size={16} />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 flex gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-text-main transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-main transition-colors">Terms</a>
          <a href="#" className="hover:text-text-main transition-colors">Help</a>
        </div>
      </main>
    </div>
  );
}
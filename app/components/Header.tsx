import { ShieldCheck, Info } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-gray-100">Banker's Algorithm Simulator</h1>
              <p className="text-sm text-gray-400">Deadlock Avoidance Algorithm</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

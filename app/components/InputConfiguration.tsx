import { Lock, Unlock } from 'lucide-react';

interface InputConfigurationProps {
  numProcesses: number;
  numResources: number;
  isLocked: boolean;
  onProcessesChange: (value: number) => void;
  onResourcesChange: (value: number) => void;
  onLock: () => void;
  onUnlock: () => void;
}

export function InputConfiguration({
  numProcesses,
  numResources,
  isLocked,
  onProcessesChange,
  onResourcesChange,
  onLock,
  onUnlock,
}: InputConfigurationProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
      <h2 className="text-gray-100 mb-4">Input Configuration</h2>
      
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-300 mb-2">
            Number of Processes (Default: 5)
          </label>
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => onProcessesChange(Number(e.target.value))}
            disabled={isLocked}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-900 disabled:text-gray-500"
            min="1"
            max="20"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm text-gray-300 mb-2">
            Number of Resources (Default: 3)
          </label>
          <input
            type="number"
            value={numResources}
            onChange={(e) => onResourcesChange(Number(e.target.value))}
            disabled={isLocked}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-900 disabled:text-gray-500"
            min="1"
            max="10"
          />
        </div>
        
        {!isLocked ? (
          <button
            onClick={onLock}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Lock Configuration
          </button>
        ) : (
          <button
            onClick={onUnlock}
            className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <Unlock className="w-4 h-4" />
            Unlock
          </button>
        )}
      </div>
    </div>
  );
}
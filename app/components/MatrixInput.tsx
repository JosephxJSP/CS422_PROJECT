import { Play } from 'lucide-react';

interface MatrixInputProps {
  numProcesses: number;
  numResources: number;
  isLocked: boolean;
  availableResources: number[];
  maxMatrix: number[][];
  allocationMatrix: number[][];
  onAvailableChange: (resources: number[]) => void;
  onMaxMatrixChange: (matrix: number[][]) => void;
  onAllocationMatrixChange: (matrix: number[][]) => void;
  onRunAlgorithm: () => void;
}

export function MatrixInput({
  numProcesses,
  numResources,
  isLocked,
  availableResources,
  maxMatrix,
  allocationMatrix,
  onAvailableChange,
  onMaxMatrixChange,
  onAllocationMatrixChange,
  onRunAlgorithm,
}: MatrixInputProps) {
  const handleAvailableChange = (index: number, value: string) => {
    const newResources = [...availableResources];
    newResources[index] = Number(value) || 0;
    onAvailableChange(newResources);
  };

  const handleMaxMatrixChange = (processIndex: number, resourceIndex: number, value: string) => {
    const newMatrix = maxMatrix.map(row => [...row]);
    newMatrix[processIndex][resourceIndex] = Number(value) || 0;
    onMaxMatrixChange(newMatrix);
  };

  const handleAllocationMatrixChange = (processIndex: number, resourceIndex: number, value: string) => {
    const newMatrix = allocationMatrix.map(row => [...row]);
    newMatrix[processIndex][resourceIndex] = Number(value) || 0;
    onAllocationMatrixChange(newMatrix);
  };

  // Calculate Need Matrix
  const needMatrix = maxMatrix.map((row, i) => 
    row.map((val, j) => Math.max(0, val - allocationMatrix[i][j]))
  );

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-100">Matrix Input Section</h2>
        <button
          onClick={onRunAlgorithm}
          disabled={!isLocked}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Run Algorithm
        </button>
      </div>
      
      {/* Available Resources */}
      <div className="mb-8">
        <h3 className="text-gray-200 mb-3">Available Resources</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(numResources, 6)}, minmax(0, 1fr))` }}>
          {Array.from({ length: numResources }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm text-gray-300 mb-2">
                R{index}
              </label>
              <input
                type="number"
                value={availableResources[index] || 0}
                onChange={(e) => handleAvailableChange(index, e.target.value)}
                disabled={!isLocked}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-900 disabled:text-gray-500"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Maximum Matrix */}
      <div className="mb-8">
        <h3 className="text-gray-200 mb-3">Maximum Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600 rounded-tl-lg">
                  Process
                </th>
                {Array.from({ length: numResources }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600">
                    R{index}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numProcesses }).map((_, processIndex) => (
                <tr key={processIndex} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-gray-200 border border-gray-600">
                    P{processIndex}
                  </td>
                  {Array.from({ length: numResources }).map((_, resourceIndex) => (
                    <td key={resourceIndex} className="px-2 py-2 border border-gray-600">
                      <input
                        type="number"
                        value={maxMatrix[processIndex]?.[resourceIndex] || 0}
                        onChange={(e) => handleMaxMatrixChange(processIndex, resourceIndex, e.target.value)}
                        disabled={!isLocked}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-900 disabled:text-gray-500"
                        min="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Matrix */}
      <div className="mb-8">
        <h3 className="text-gray-200 mb-3">Allocation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600 rounded-tl-lg">
                  Process
                </th>
                {Array.from({ length: numResources }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600">
                    R{index}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numProcesses }).map((_, processIndex) => (
                <tr key={processIndex} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-gray-200 border border-gray-600">
                    P{processIndex}
                  </td>
                  {Array.from({ length: numResources }).map((_, resourceIndex) => (
                    <td key={resourceIndex} className="px-2 py-2 border border-gray-600">
                      <input
                        type="number"
                        value={allocationMatrix[processIndex]?.[resourceIndex] || 0}
                        onChange={(e) => handleAllocationMatrixChange(processIndex, resourceIndex, e.target.value)}
                        disabled={!isLocked}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-900 disabled:text-gray-500"
                        min="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Need Matrix (Read-only, auto-calculated) */}
      <div>
        <h3 className="text-gray-200 mb-3">Need Matrix (Auto-calculated: Max - Allocation)</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600 rounded-tl-lg">
                  Process
                </th>
                {Array.from({ length: numResources }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600">
                    R{index}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numProcesses }).map((_, processIndex) => (
                <tr key={processIndex} className="bg-blue-900/30">
                  <td className="px-4 py-3 text-gray-200 border border-gray-600">
                    P{processIndex}
                  </td>
                  {Array.from({ length: numResources }).map((_, resourceIndex) => (
                    <td key={resourceIndex} className="px-4 py-3 text-center border border-gray-600 text-gray-200">
                      {needMatrix[processIndex]?.[resourceIndex] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
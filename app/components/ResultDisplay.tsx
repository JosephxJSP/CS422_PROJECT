import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface AlgorithmStep {
  step: number;
  processId: number;
  work: number[];
  finish: boolean[];
  message: string;
}

interface ResultDisplayProps {
  isSafe: boolean;
  safeSequence: number[] | null;
  steps: AlgorithmStep[];
  finalWork: number[];
  finalFinish: boolean[];
  numResources: number;
  numProcesses: number;
  maxMatrix: number[][];
  allocationMatrix: number[][];
}

export function ResultDisplay({ 
  isSafe, 
  safeSequence, 
  steps, 
  finalWork, 
  finalFinish,
  numResources,
  numProcesses,
  maxMatrix,
  allocationMatrix
}: ResultDisplayProps) {
  // Calculate Need Matrix
  const needMatrix = maxMatrix.map((row, i) => 
    row.map((val, j) => Math.max(0, val - allocationMatrix[i][j]))
  );

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isSafe ? 'bg-green-950 border-green-800' : 'bg-red-950 border-red-800'
      }`}>
        <div className="flex items-start gap-4">
          {isSafe ? (
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          )}
          
          <div className="flex-1">
            <h3 className={`mb-2 ${isSafe ? 'text-green-100' : 'text-red-100'}`}>
              {isSafe ? 'System is in Safe State ✓' : 'System is Unsafe / Deadlock Detected ✗'}
            </h3>
            
            {isSafe && safeSequence ? (
              <div>
                <p className="text-sm text-green-200 mb-3">
                  พบ Safe Sequence แล้ว! ระบบสามารถจัดสรรทรัพยากรได้โดยไม่เกิด Deadlock
                </p>
                <div className="flex flex-wrap gap-2">
                  {safeSequence.map((processId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-gray-800 border border-green-700 rounded-lg text-green-100">
                        P{processId}
                      </div>
                      {index < safeSequence.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-green-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-200">
                ไม่พบ Safe Sequence! ระบบอาจเข้าสู่ภาวะ Deadlock กรุณาตรวจสอบการจัดสรรทรัพยากรใหม่
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Results Tables */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
        <h2 className="text-gray-100 mb-6">ผลลัพธ์การคำนวณ</h2>

        {/* Need Matrix */}
        <div className="mb-8">
          <h3 className="text-gray-200 mb-3">Need Matrix (Max - Allocation)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-4 py-3 text-left text-sm text-gray-300 border border-gray-600">
                    Process
                  </th>
                  {Array.from({ length: numResources }).map((_, index) => (
                    <th key={index} className="px-4 py-3 text-center text-sm text-gray-300 border border-gray-600">
                      R{index}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numProcesses }).map((_, processIndex) => (
                  <tr key={processIndex}>
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

        {/* Final Work Array */}
        <div className="mb-8">
          <h3 className="text-gray-200 mb-3">Work Array (ทรัพยากรคงเหลือสุดท้าย)</h3>
          <div className="flex gap-4">
            {finalWork.map((value, index) => (
              <div key={index} className="flex-1">
                <div className="bg-blue-950 border border-blue-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-300 mb-1">R{index}</div>
                  <div className="text-xl text-gray-100">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finish Array */}
        <div className="mb-8">
          <h3 className="text-gray-200 mb-3">Finish Array (สถานะการทำงานเสร็จของแต่ละ Process)</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(numProcesses, 5)}, minmax(0, 1fr))` }}>
            {finalFinish.map((isFinished, index) => (
              <div key={index} className={`border rounded-lg p-3 text-center ${
                isFinished ? 'bg-green-950 border-green-700' : 'bg-red-950 border-red-700'
              }`}>
                <div className="text-sm text-gray-300 mb-1">P{index}</div>
                <div className={`text-sm ${isFinished ? 'text-green-300' : 'text-red-300'}`}>
                  {isFinished ? '✓ Finished' : '✗ Not Finished'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safe Sequence Display */}
        {safeSequence && (
          <div>
            <h3 className="text-gray-200 mb-3">Safe Sequence</h3>
            <div className="bg-green-950 border border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-300">ลำดับการทำงาน:</span>
                {safeSequence.map((processId, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-800 border border-green-700 rounded text-green-100">
                      P{processId}
                    </span>
                    {index < safeSequence.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Execution */}
      {steps.length > 0 && (
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
          <h2 className="text-gray-100 mb-4">ขั้นตอนการทำงานของอัลกอริทึม (Step-by-Step)</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                step.processId === -1 ? 'bg-blue-950 border-blue-800' : 'bg-gray-900 border-gray-700'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-1 rounded text-sm flex-shrink-0 ${
                    step.processId === -1 ? 'bg-blue-800 text-blue-100' : 'bg-gray-700 text-gray-100'
                  }`}>
                    Step {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-100 mb-2">{step.message}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Work:</p>
                        <div className="flex gap-2">
                          {step.work.map((value, i) => (
                            <span key={i} className="text-sm text-gray-200 bg-gray-800 px-2 py-1 rounded border border-gray-600">
                              R{i}: {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Finish:</p>
                        <div className="flex gap-2 flex-wrap">
                          {step.finish.map((finished, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded ${
                              finished ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                            }`}>
                              P{i}: {finished ? 'T' : 'F'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
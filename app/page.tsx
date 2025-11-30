"use client";

import { useState } from 'react';
import { Header } from './components/Header';
import { InputConfiguration } from './components/InputConfiguration';
import { MatrixInput } from './components/MatrixInput';
import { ResultDisplay } from './components/ResultDisplay';

interface AlgorithmStep {
  step: number;
  processId: number;
  work: number[];
  finish: boolean[];
  message: string;
}

export default function App() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [availableResources, setAvailableResources] = useState<number[]>([3, 3, 2]);
  const [maxMatrix, setMaxMatrix] = useState<number[][]>(
    Array(5).fill(null).map(() => Array(3).fill(0))
  );
  const [allocationMatrix, setAllocationMatrix] = useState<number[][]>(
    Array(5).fill(null).map(() => Array(3).fill(0))
  );
  const [safeSequence, setSafeSequence] = useState<number[] | null>(null);
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [finalWork, setFinalWork] = useState<number[]>([]);
  const [finalFinish, setFinalFinish] = useState<boolean[]>([]);

  const handleLockConfiguration = () => {
    setIsLocked(true);
    // Resize matrices based on new dimensions
    const newMax = Array(numProcesses).fill(null).map((_, i) => 
      Array(numResources).fill(null).map((_, j) => maxMatrix[i]?.[j] || 0)
    );
    const newAllocation = Array(numProcesses).fill(null).map((_, i) => 
      Array(numResources).fill(null).map((_, j) => allocationMatrix[i]?.[j] || 0)
    );
    const newAvailable = Array(numResources).fill(null).map((_, i) => availableResources[i] || 0);
    
    setMaxMatrix(newMax);
    setAllocationMatrix(newAllocation);
    setAvailableResources(newAvailable);
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setSafeSequence(null);
    setIsSafe(null);
    setSteps([]);
    setFinalWork([]);
    setFinalFinish([]);
  };

  const runBankersAlgorithm = () => {
    // Calculate Need Matrix
    const need = maxMatrix.map((row, i) => 
      row.map((val, j) => val - allocationMatrix[i][j])
    );

    // Run safety algorithm with step tracking
    const work = [...availableResources];
    const finish = Array(numProcesses).fill(false);
    const sequence: number[] = [];
    const algorithmSteps: AlgorithmStep[] = [];

    // Initial state
    algorithmSteps.push({
      step: 0,
      processId: -1,
      work: [...work],
      finish: [...finish],
      message: 'เริ่มต้นระบบ: Work = Available'
    });

    let count = 0;
    let stepNumber = 1;
    
    while (count < numProcesses) {
      let found = false;
      
      for (let i = 0; i < numProcesses; i++) {
        if (!finish[i]) {
          let canAllocate = true;
          
          for (let j = 0; j < numResources; j++) {
            if (need[i][j] > work[j]) {
              canAllocate = false;
              break;
            }
          }
          
          if (canAllocate) {
            // Allocate resources
            for (let j = 0; j < numResources; j++) {
              work[j] += allocationMatrix[i][j];
            }
            sequence.push(i);
            finish[i] = true;
            found = true;
            count++;

            // Record step
            algorithmSteps.push({
              step: stepNumber++,
              processId: i,
              work: [...work],
              finish: [...finish],
              message: `Process P${i} สามารถทำงานได้ (Need ≤ Work) → รัน P${i} แล้วคืนทรัพยากร`
            });
          }
        }
      }
      
      if (!found) {
        break;
      }
    }

    setSteps(algorithmSteps);
    setFinalWork(work);
    setFinalFinish(finish);

    if (count === numProcesses) {
      setSafeSequence(sequence);
      setIsSafe(true);
    } else {
      setSafeSequence(null);
      setIsSafe(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <InputConfiguration 
          numProcesses={numProcesses}
          numResources={numResources}
          isLocked={isLocked}
          onProcessesChange={setNumProcesses}
          onResourcesChange={setNumResources}
          onLock={handleLockConfiguration}
          onUnlock={handleUnlock}
        />
        
        <MatrixInput 
          numProcesses={numProcesses}
          numResources={numResources}
          isLocked={isLocked}
          availableResources={availableResources}
          maxMatrix={maxMatrix}
          allocationMatrix={allocationMatrix}
          onAvailableChange={setAvailableResources}
          onMaxMatrixChange={setMaxMatrix}
          onAllocationMatrixChange={setAllocationMatrix}
          onRunAlgorithm={runBankersAlgorithm}
        />

        {isSafe !== null && (
          <ResultDisplay 
            isSafe={isSafe}
            safeSequence={safeSequence}
            steps={steps}
            finalWork={finalWork}
            finalFinish={finalFinish}
            numResources={numResources}
            numProcesses={numProcesses}
            maxMatrix={maxMatrix}
            allocationMatrix={allocationMatrix}
          />
        )}
      </main>
    </div>
  );
}
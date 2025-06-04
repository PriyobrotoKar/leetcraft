import { ExecuteCodePayload } from '@/api/services/execute-code';
import { createContext, useContext, useState } from 'react';

interface SolutionContextType {
  solution: ExecuteCodePayload | null;
  setSolution: React.Dispatch<React.SetStateAction<ExecuteCodePayload | null>>;
}

const SolutionContext = createContext<SolutionContextType | null>(null);

function SolutionProvider({ children }: { children: React.ReactNode }) {
  const [solution, setSolution] = useState<ExecuteCodePayload | null>(null);

  return (
    <SolutionContext.Provider
      value={{
        solution,
        setSolution,
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
}

export default SolutionProvider;

export function useSolution() {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error('useSolution must be used within a SolutionProvider');
  }
  return context;
}

'use client';
import { createContext, useContext, type ReactNode } from 'react';

const AnimationContext = createContext('fade');

export function AnimationContextProvider({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimationVariant = () => useContext(AnimationContext);

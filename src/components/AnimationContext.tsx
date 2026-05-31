'use client';
import { createContext, useContext } from 'react';

const AnimationContext = createContext('fade');
export const AnimationContextProvider = AnimationContext.Provider;
export const useAnimationVariant = () => useContext(AnimationContext);

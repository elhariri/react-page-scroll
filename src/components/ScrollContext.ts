import { createContext, useContext } from 'react';
import { ScrollManager } from '../App/ScrollManager';

export const ScrollContext = createContext<ScrollManager | null>(null);

export function useScrollContext() {
  return useContext(ScrollContext);
}

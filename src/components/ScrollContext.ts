import { createContext, useContext } from 'react';
import { ScrollManager } from '../App/ScrollManager';

export const ScrollContext = createContext<{ scrollManager: ScrollManager | null; scrollContext: true }>({
  scrollManager: null,
  scrollContext: true,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

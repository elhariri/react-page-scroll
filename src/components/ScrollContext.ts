import { createContext, useContext } from 'react';
import ScrollController from '../App/ScrollController/ScrollController';

export const ScrollContext = createContext<{ scrollController: ScrollController | null; scrollContext: true }>({
  scrollController: null,
  scrollContext: true,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

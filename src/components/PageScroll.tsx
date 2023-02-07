import React, { useEffect, useState } from 'react';
import ScrollController from '../App/ScrollController/ScrollController';
import { PageScrollProps } from './Props.types';
import { ScrollContext } from './ScrollContext';
import ScrollingSection from './ScrollingSection';

export default function PageScroll({ children, ...props }: PageScrollProps) {
  const [scrollController, setScrollController] = useState<ScrollController | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !scrollController) {
      const containerScrollController = new ScrollController();
      containerScrollController.subscribe();
      setScrollController(containerScrollController);
    }
    return () => {
      scrollController?.unsubscribe();
    };
  }, [scrollController]);

  return (
    <ScrollContext.Provider value={{ scrollController, scrollContext: true }}>
      <ScrollingSection {...props} scrollEnabled={true} isRoot={true}>
        {children}
      </ScrollingSection>
    </ScrollContext.Provider>
  );
}

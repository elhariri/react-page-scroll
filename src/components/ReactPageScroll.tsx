import React, { useEffect, useState } from 'react';
import { ScrollManager } from '../App/ScrollManager';
import { ReactPageScrollProps } from './Props.types';
import { ScrollContext } from './ScrollContext';
import ScrollingSection from './ScrollingSection';

export default function ReactPageScroll({ children, ...props }: ReactPageScrollProps) {
  const [scrollManager, setScrollManager] = useState<ScrollManager | null>(null);

  useEffect(() => {
    if (!scrollManager) {
      setScrollManager(new ScrollManager());
    }
  }, [scrollManager]);

  return (
    <ScrollContext.Provider value={scrollManager}>
      <ScrollingSection {...props} scrollEnabled={true} isRoot={true}>
        {children}
      </ScrollingSection>
    </ScrollContext.Provider>
  );
}

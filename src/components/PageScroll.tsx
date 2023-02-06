import React, { useEffect, useState } from 'react';
import { ScrollManager } from '../App/ScrollManager';
import { PageScrollProps } from './Props.types';
import { ScrollContext } from './ScrollContext';
import ScrollingSection from './ScrollingSection';

export default function PageScroll({ children, ...props }: PageScrollProps) {
  const [scrollManager, setScrollManager] = useState<ScrollManager | null>(null);

  useEffect(() => {
    if (!scrollManager) {
      setScrollManager(new ScrollManager());
    }
  }, [scrollManager]);

  return (
    <ScrollContext.Provider value={{ scrollManager, scrollContext: true }}>
      <ScrollingSection {...props} scrollEnabled={true} isRoot={true}>
        {children}
      </ScrollingSection>
    </ScrollContext.Provider>
  );
}

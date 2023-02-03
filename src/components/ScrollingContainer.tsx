import React, { useEffect, useState } from 'react';
import { ScrollManager } from '../App/ScrollManager';
import { ScrollContext } from './ScrollContext';
import ScrollingSection, { ScrollingSectionProps } from './ScrollingSection';

export default function ScrollingContainer({ children, ...props }: ScrollingSectionProps) {
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

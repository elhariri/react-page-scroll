import React from 'react';
import { ReactPageScrollProps } from './Props.types';
import ScrollingSection from './ScrollingSection';

export default function NestedReactPageScroll({ children, ...props }: ReactPageScrollProps) {
  return (
    <ScrollingSection {...props} scrollEnabled={true} isRoot={false}>
      {children}
    </ScrollingSection>
  );
}

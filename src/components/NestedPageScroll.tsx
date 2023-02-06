import React from 'react';
import { PageScrollProps } from './Props.types';
import ScrollingSection from './ScrollingSection';

export default function NestedPageScroll({ children, ...props }: PageScrollProps) {
  return (
    <ScrollingSection {...props} scrollEnabled={true} isRoot={false}>
      {children}
    </ScrollingSection>
  );
}

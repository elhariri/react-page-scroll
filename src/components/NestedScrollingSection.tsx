import React from 'react';
import ScrollingSection, { ScrollingSectionProps } from './ScrollingSection';

export default function NestedScrollingSection({ children, ...props }: ScrollingSectionProps) {
  return (
    <ScrollingSection {...props} scrollEnabled={true} isRoot={false}>
      {children}
    </ScrollingSection>
  );
}

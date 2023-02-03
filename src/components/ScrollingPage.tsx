import React from 'react';
import ScrollingSection, { ScrollingSectionProps } from './ScrollingSection';

export default function ScrollingPage({ children, ...props }: ScrollingSectionProps) {
  return (
    <ScrollingSection {...props} isRoot={false}>
      {children}
    </ScrollingSection>
  );
}

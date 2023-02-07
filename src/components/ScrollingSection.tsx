import React, { useEffect, useRef } from 'react';
import { ScrollAxes, ScrollHandlerState, ScrollingSectionProps } from './Props.types';
import { useScrollContext } from './ScrollContext';

const scrollHandlerStateInitialState: ScrollHandlerState = {
  currentChildIndex: 0,
  scrollState: 'stationary',
  childs: [],
  pagesContainer: null as unknown as HTMLElement,
  direction: ScrollAxes.vertical,
  scrollEnabled: false,
  animationDuration: 400,
  isRoot: false,
};

export default function ScrollingSection({
  children,
  scrollEnabled = false,
  animationDuration = 400,
  animationEasing = 'cubic-bezier(0.76, 0, 0.24, 1)',
  direction = ScrollAxes.vertical,
  isRoot = false,
  width = '100vw',
  height = '100vh',
  onScrollStart = () => {},
  onScrollInit = () => {},
  onScrollCommandCede = () => {},
  onScrollEnd = () => {},
}: ScrollingSectionProps) {
  const scrollStateRef = useRef<ScrollHandlerState>({
    ...scrollHandlerStateInitialState,
    direction,
    scrollEnabled,
    animationDuration,
    isRoot,
    onScrollStart,
    onScrollEnd,
    onScrollInit,
    onScrollCommandCede,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollSubscribed = useRef(false);

  const { scrollController, scrollContext } = useScrollContext();

  useEffect(() => {
    if (scrollController && !scrollSubscribed.current) {
      const containerRef = scrollContainerRef.current;
      let scrollState = scrollStateRef.current;

      if (containerRef) {
        const pagesContainerAsNodes = containerRef.childNodes[0];
        const pagesContainer = pagesContainerAsNodes as unknown as HTMLElement;
        const childsAsNodes = pagesContainer.childNodes;
        const childs = childsAsNodes as unknown as HTMLElement[];

        scrollState = {
          ...scrollState,
          pagesContainer,
          childs,
        };

        scrollController.addScrollContainer(scrollContainerRef.current, scrollState);
        scrollSubscribed.current = true;
      }
    }
  }, [scrollController, isRoot]);

  if (!scrollContext && !isRoot) {
    throw new Error('Only use <NestedPageScroll> inside <PageScroll>');
  }

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        <div
          style={{
            transition: `transform ${animationDuration}ms ${animationEasing}`,
          }}
          className={(direction === 'vertical' ? 'flex-col' : 'flex') + ' scroll-container'}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { ScrollDirections, ScrollHandlerState, ScrollManagerSubscribeOptions } from '../App/Scroll.types';
import { useScrollContext } from './ScrollContext';

export interface ScrollingSectionProps extends ScrollManagerSubscribeOptions {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  width?: string;
  height?: string;
}

const scrollHandlerStateInitialState: ScrollHandlerState = {
  currentChildIndex: 0,
  scrollState: {
    YDirection: 'stationary',
    XDirection: 'stationary',
  },
  childs: [],
  handlingScrolling: false,
  lastTarget: null,
  pagesContainer: null as unknown as HTMLElement,
  direction: ScrollDirections.verticle,
  scrollEnabled: false,
  animationDuration: 400,
  isRoot: false,
};

export default function ScrollingSection({
  children,
  scrollEnabled = false,
  animationDuration = 400,
  animationEasing = 'cubic-bezier(0.76, 0, 0.24, 1)',

  direction = ScrollDirections.verticle,
  isRoot = false,
  width = '100vw',
  height = '100vh',
  onBeforeScroll = () => {},
  onScrollInit = () => {},
  onScrollExit = () => {},
  onAfterScroll = () => {},
}: ScrollingSectionProps) {
  const scrollStateRef = useRef<ScrollHandlerState>({
    ...scrollHandlerStateInitialState,
    direction,
    scrollEnabled,
    animationDuration,
    isRoot,
    onBeforeScroll,
    onAfterScroll,
    onScrollInit,
    onScrollExit,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollSubscribed = useRef(false);

  const contextScrollManager = useScrollContext();

  useEffect(() => {
    if (contextScrollManager && !scrollSubscribed.current) {
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

        contextScrollManager.subscribe(scrollContainerRef.current, scrollState);
        scrollSubscribed.current = true;
      }
    }
  }, [contextScrollManager, isRoot]);

  return (
    <div
      style={{
        width,
        height,
      }}
      className='relative z-30 overflow-hidden'
    >
      <div ref={scrollContainerRef} className={`absolute w-full h-full z-30 overflow-hidden`}>
        <div
          style={{
            transition: `transform ${animationDuration}ms ${animationEasing}`,
          }}
          className='top-0 w-full h-full overflow-visible flex-col text-white ease-in-out'
        >
          {children}
        </div>
      </div>
    </div>
  );
}

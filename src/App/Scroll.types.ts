export enum ScrollAxes {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum DataSetsAttributes {
  reactScrollPage = 'react-scroll-page',
  reactScrollPageIndex = 'react-scroll-page-index',
}

export type ScrollAxis = `${ScrollAxes}`;

export type XdirectionState = 'left' | 'right' | 'stationary';
export type YdirectionState = 'up' | 'down' | 'stationary';

export type ScrollMove = 'up' | 'down' | 'left' | 'right' | null;

export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'stationary';

export interface Gesture {
  id: number;
  scrollDiretion: ScrollDirection;
}

export interface ScrollManagerSubscribeOptionsParams {
  direction?: ScrollAxis;
  isRoot?: boolean;
  animationDuration?: number;
  animationEasing?: string;
}

export type ScrollManagerSubscribeOptions = ScrollManagerSubscribeOptionsParams & ScrollHandlerHooks;

export type ScrollStackItem = {
  hash: string;
  scrollState: { reachedEndOfDocument: boolean; direction: ScrollMove };
};

export type OnScrollEvent = (targets: { targetIndex: number }) => void;

export type OnScrollEnd = (targets: { currentIndex: number }) => void;

export interface ScrollControls {
  scrollTo: (index: number) => void;
  scrollToNext: () => void;
  scrollToPrevious: () => void;
}

export interface ScrollHandlerHooks {
  onScrollInit?: ({
    currentChildIndex,
    numberOfChilds,
    scrollControl,
  }: {
    currentChildIndex: number;
    numberOfChilds: number;
    scrollControl: ScrollControls;
  }) => void;
  onScrollEnd?: OnScrollEnd;
  onScrollStart?: OnScrollEvent;
  onScrollCommandCede?: ({ lastChildIndex }: { lastChildIndex: number }) => void;
}

export interface ScrollHandlerStateParams {
  scrollState: ScrollDirection;
  currentChildIndex: number;
  childs: HTMLElement[];
  pagesContainer: HTMLElement;
  direction: ScrollAxis;
  scrollEnabled: boolean;
  animationDuration: number;
  isRoot: boolean;
}

export type ScrollHandlerState = ScrollHandlerStateParams & ScrollHandlerHooks;

export enum ScrollDirections {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum DataSetsAttributes {
  reactScrollPage = 'react-scroll-page',
  reactScrollPageIndex = 'react-scroll-page-index',
}

export type ScrollDirection = `${ScrollDirections}`;

export type XdirectionState = 'left' | 'right' | 'stationary';
export type YdirectionState = 'up' | 'down' | 'stationary';

export type ScrollMove = 'up' | 'down' | 'left' | 'right' | null;

export interface ScrollState {
  YDirection: YdirectionState;
  XDirection: XdirectionState;
}

export interface ScrollManagerSubscribeOptionsParams {
  direction?: ScrollDirection;
  isRoot?: boolean;
  animationDuration?: number;
  animationEasing?: string;
}

export type ScrollManagerSubscribeOptions = ScrollManagerSubscribeOptionsParams & ScrollHandlerHooks;

export type ScrollStackItem = {
  hash: string;
  scrollState: { reachedEndOfDocument: boolean; direction: ScrollMove };
};

export type OnScrollEvent = (targets: {
  currentIndex: number;
  currentTarget?: HTMLElement;
  nextIndex?: number;
  nextTarget?: HTMLElement;
}) => void;

export type OnScrollEnd = (targets: { currentIndex: number; currentTarget: HTMLElement }) => void;

export interface ScrollControls {
  scrollTo: (index: number) => void;
  scrollToNext: () => void;
  scrollToPrevious: () => void;
}

export interface ScrollHandlerHooks {
  onScrollInit?: ({
    container,
    currentChildIndex,
    numberOfChilds,
    scrollControl,
  }: {
    container: HTMLElement;
    currentChildIndex: number;
    numberOfChilds: number;
    scrollControl: ScrollControls;
  }) => void;
  onAfterScroll?: OnScrollEnd;
  onBeforeScroll?: OnScrollEvent;
  onScrollCommandChange?: ({
    container,
    currentChildIndex,
    numberOfChilds,
  }: {
    container: HTMLElement;
    currentChildIndex: number;
    numberOfChilds: number;
  }) => void;
}

export interface ScrollHandlerStateParams {
  scrollState: ScrollState;
  currentChildIndex: number;
  childs: HTMLElement[];
  pagesContainer: HTMLElement;
  direction: ScrollDirection;
  scrollEnabled: boolean;
  animationDuration: number;
  isRoot: boolean;
}

export type ScrollHandlerState = ScrollHandlerStateParams & ScrollHandlerHooks;

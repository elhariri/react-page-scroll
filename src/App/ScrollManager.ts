import { ScrollControls, ScrollHandlerState, ScrollStackItem, ScrollState } from './Scroll.types';
import SectionScrollHandler from './SectionScrollHandler';

class ScrollStack {
  private stack: ScrollStackItem[] = [];

  constructor(scrollHandlerHash?: ScrollStackItem) {
    if (scrollHandlerHash) {
      this.stack.push(scrollHandlerHash);
    }
  }

  push(scrollHandlerHash: ScrollStackItem): void {
    this.stack.push(scrollHandlerHash);
  }

  pop(): ScrollStackItem | undefined {
    return this.stack.pop();
  }

  item(i: number): ScrollStackItem {
    return { ...this.stack[i] };
  }

  get length() {
    return this.stack.length;
  }

  get current(): ScrollStackItem {
    return this.stack[this.length - 1];
  }

  get previous(): ScrollStackItem {
    return this.stack[this.length - 2];
  }
}

class ScrollControl implements ScrollControls {
  private scrollManager: ScrollManager;

  constructor(scrollManager: ScrollManager) {
    this.scrollManager = scrollManager;
  }

  scrollTo(target: number) {
    this.scrollManager.activeScrollHandler.scrollTo(target);
  }

  scrollToNext() {
    const { currentChildIndex, childs } = this.scrollManager.activeScrollHandler.UIScrollStateCopy;
    const nextTargetIndex = Math.min(currentChildIndex + 1, childs.length - 1);
    this.scrollTo(nextTargetIndex);
  }

  scrollToPrevious() {
    const { currentChildIndex } = this.scrollManager.activeScrollHandler.UIScrollStateCopy;
    const nextTargetIndex = Math.max(currentChildIndex - 1, 0);
    this.scrollTo(nextTargetIndex);
  }
}

export class ScrollManager {
  private scrollStack: ScrollStack = new ScrollStack();

  private scrollHandlersMap: { [key: string]: SectionScrollHandler } = {};

  private scrollControl: ScrollControls = new ScrollControl(this);

  private getScrollMove(scrollState: ScrollState) {
    const { XDirection, YDirection } = scrollState;

    if (YDirection !== 'stationary') {
      return YDirection;
    }

    if (XDirection !== 'stationary') {
      return XDirection;
    }

    return null;
  }

  private hasReachedEndOfDocument(currentChildIndex: number, childs: HTMLElement[], scrollState: ScrollState) {
    const scrollMove = this.getScrollMove(scrollState) || '';

    const reachedEndOfDocument = ['down', 'left'].includes(scrollMove) && currentChildIndex === childs.length - 1;
    const reachedStartOfDocument = ['up', 'right'].includes(scrollMove) && !currentChildIndex;

    const reachedDocumentStartOrEnd = reachedEndOfDocument || reachedStartOfDocument;

    if (this.scrollStack.previous) {
      const currentScrollDirection = this.scrollHandlersMap[this.scrollStack.current.hash].UIScrollStateCopy.direction;
      const parentScrollDirection = this.scrollHandlersMap[this.scrollStack.previous.hash].UIScrollStateCopy.direction;

      return currentScrollDirection === parentScrollDirection && reachedDocumentStartOrEnd;
    }

    return reachedDocumentStartOrEnd;
  }

  private shouldParentResumeScrolling(scrollState: ScrollState) {
    const scrollMove = this.getScrollMove(scrollState) || '';

    const currentScrollDirection = this.scrollHandlersMap[this.scrollStack.current.hash].UIScrollStateCopy.direction;
    const parentScrollDirection = this.scrollHandlersMap[this.scrollStack.previous.hash].UIScrollStateCopy.direction;

    if (currentScrollDirection !== parentScrollDirection) {
      if (parentScrollDirection === 'horizontal' && ['left', 'right'].includes(scrollMove)) {
        return true;
      }

      if (parentScrollDirection === 'vertical' && ['up', 'down'].includes(scrollMove)) {
        return true;
      }
    }

    return false;
  }

  private transferControlToChild(childNodeHash: string) {
    const currentScrollHandlerHash = this.scrollStack.current?.hash;
    const currentScrollHandler = this.scrollHandlersMap[currentScrollHandlerHash];
    const { currentChildIndex, childs, scrollState } = currentScrollHandler.UIScrollStateCopy;

    currentScrollHandler.disable();
    this.scrollStack.current.scrollState = {
      reachedEndOfDocument: this.hasReachedEndOfDocument(currentChildIndex, childs, scrollState),
      direction: this.getScrollMove(scrollState),
    };

    const childScrollHandler = this.scrollHandlersMap[childNodeHash];

    this.initializeScrollHandler(childScrollHandler);

    this.scrollStack.push({
      hash: childNodeHash,
      scrollState: { reachedEndOfDocument: false, direction: null },
    });

    return true;
  }

  private transferControlToParent(scrollState: ScrollState) {
    for (let i = this.scrollStack.length - 2; i >= 0; i--) {
      const {
        scrollState: { reachedEndOfDocument, direction },
        hash,
      } = this.scrollStack.item(i);

      const nextScrollDirection = this.getScrollMove(scrollState);

      if (!(reachedEndOfDocument && direction === nextScrollDirection)) {
        let currentHash = '';
        for (let j = this.scrollStack.length - 1; j > i; j--) {
          currentHash = this.scrollStack.pop()?.hash || '';
          this.scrollHandlersMap[currentHash].disable();
        }

        const { onScrollCommandCede, pagesContainer, currentChildIndex } =
          this.scrollHandlersMap[currentHash].UIScrollStateCopy;
        if (pagesContainer.parentElement && onScrollCommandCede) {
          onScrollCommandCede({
            lastChildIndex: currentChildIndex,
          });
        }

        this.initializeScrollHandler(this.scrollHandlersMap[hash]);

        return true;
      }
    }

    return false; //this was added
  }

  private initializeScrollHandler(sectionScrollHandler: SectionScrollHandler) {
    sectionScrollHandler.init(this.scrollControl);
  }

  get activeScrollHandler() {
    return this.scrollHandlersMap[this.scrollStack.current.hash];
  }

  shouldCedeControlToChld({ childs, currentChildIndex }: ScrollHandlerState) {
    const currentNodeHash = childs[currentChildIndex].dataset.reactScroller;

    if (currentNodeHash) {
      return this.transferControlToChild(currentNodeHash);
    }

    return false;
  }

  shouldCedeControlToParent({ childs, currentChildIndex, scrollState }: ScrollHandlerState) {
    if (
      this.shouldParentResumeScrolling(scrollState) ||
      this.hasReachedEndOfDocument(currentChildIndex, childs, scrollState)
    ) {
      return this.transferControlToParent(scrollState);
    }

    return false;
  }

  subscribe(container: HTMLDivElement, scrollUIState: ScrollHandlerState) {
    const sectionScrollHandler = new SectionScrollHandler(container, scrollUIState, this);

    const { currentChildIndex, childs, scrollState, isRoot } = scrollUIState;
    if (isRoot) {
      this.scrollHandlersMap.root = sectionScrollHandler;
      this.scrollStack.push({
        hash: 'root',
        scrollState: {
          reachedEndOfDocument: this.hasReachedEndOfDocument(currentChildIndex, childs, scrollState),
          direction: this.getScrollMove(scrollState),
        },
      });
      this.initializeScrollHandler(sectionScrollHandler);
    } else {
      const hash = 'nested-' + (Object.keys(this.scrollHandlersMap).length + 1);
      this.scrollHandlersMap[hash] = sectionScrollHandler;

      (sectionScrollHandler.container?.parentElement as HTMLDivElement).setAttribute('data-react-scroller', hash);
    }

    return sectionScrollHandler;
  }
}

export const scrollManager = new ScrollManager();

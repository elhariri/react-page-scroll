import { isHorizontalDirection, isVerticalDirection } from './helper';
import { Gesture, ScrollHandlerState, ScrollStackItem } from './Scroll.types';
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

export class ScrollManager {
  private scrollStack: ScrollStack = new ScrollStack();

  private scrollHandlersMap: { [key: string]: SectionScrollHandler } = {};

  private lastHandledGestureId = 0;

  get activeScrollHandler() {
    return this.scrollHandlersMap[this.scrollStack.current.hash];
  }

  subscribe(container: HTMLDivElement, scrollUIState: ScrollHandlerState) {
    const sectionScrollHandler = new SectionScrollHandler(container, scrollUIState /* , this */);

    const { isRoot } = scrollUIState;

    if (isRoot) {
      this.scrollHandlersMap.root = sectionScrollHandler;
      this.scrollStack.push({
        hash: 'root',
        scrollState: {
          reachedEndOfDocument: false,
          direction: null,
        },
      });
      //this.initializeScrollHandler(sectionScrollHandler);
    } else {
      const hash = 'nested-' + (Object.keys(this.scrollHandlersMap).length + 1);
      this.scrollHandlersMap[hash] = sectionScrollHandler;

      (sectionScrollHandler.container?.parentElement as HTMLDivElement).setAttribute('data-react-scroller', hash);
    }

    return sectionScrollHandler;
  }

  async handleScroll({ id, scrollDiretion }: Gesture) {
    const { direction, currentChildIndex, childs, onScrollEnd } = this.activeScrollHandler.UIScrollStateCopy;
    const shouldScroll =
      (isVerticalDirection(scrollDiretion) && direction === 'vertical') ||
      (isHorizontalDirection(scrollDiretion) && direction === 'horizontal');

    if (id > this.lastHandledGestureId && shouldScroll) {
      this.lastHandledGestureId = id;

      const nextTargetIndex = this.activeScrollHandler.nextChild(scrollDiretion);

      const hasReachEndOfDocument =
        currentChildIndex === nextTargetIndex && (nextTargetIndex === 0 || nextTargetIndex === childs.length - 1);

      if (!hasReachEndOfDocument) {
        await this.activeScrollHandler.scrollTo(nextTargetIndex);

        if (onScrollEnd) {
          onScrollEnd({
            currentIndex: currentChildIndex,
          });
        }
      }
    }
  }
}

export const scrollManager = new ScrollManager();

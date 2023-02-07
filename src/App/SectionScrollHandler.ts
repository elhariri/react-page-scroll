import { ScrollHandlerState, ScrollDirection } from './Scroll.types';
import UIScrollAnimation from './UIScrollAnimation';

class SectionScrollHandler {
  readonly container: HTMLDivElement;

  private scrollUIState: ScrollHandlerState;

  constructor(container: HTMLDivElement, scrollUIState: ScrollHandlerState) {
    this.container = container;
    this.scrollUIState = scrollUIState;
  }

  nextChild(scrollDirection: ScrollDirection) {
    const { currentChildIndex, childs } = this.scrollUIState;
    if (scrollDirection !== 'stationary') {
      if (['down', 'left'].includes(scrollDirection)) {
        return Math.min(currentChildIndex + 1, childs.length - 1);
      } else if (['up', 'right'].includes(scrollDirection)) {
        return Math.max(currentChildIndex - 1, 0);
      }
    }

    return currentChildIndex;
  }

  async scrollTo(target: number) {
    this.scrollUIState.currentChildIndex = target;

    await this.scroll();
  }

  async scroll() {
    const { onScrollStart, childs, currentChildIndex, animationDuration, direction, pagesContainer } =
      this.scrollUIState;

    if (onScrollStart) {
      onScrollStart({
        targetIndex: currentChildIndex,
      });
    }

    await UIScrollAnimation.fireScroll({
      childs,
      currentChildIndex,
      animationDuration,
      direction,
      pagesContainer,
    });
  }

  get UIScrollStateCopy(): ScrollHandlerState {
    return {
      ...this.scrollUIState,
      scrollState: this.scrollUIState.scrollState,
    };
  }
}

export default SectionScrollHandler;

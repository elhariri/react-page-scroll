import { ScrollDirection, ScrollDirections } from './Scroll.types';

class UIScrollAnimation {
  static fireScroll({
    currentChildIndex,
    childs,
    pagesContainer,
    direction,
    onScrollEnd,
    animationDuration,
  }: {
    currentChildIndex: number;
    childs: HTMLElement[];
    pagesContainer: HTMLElement;
    direction: ScrollDirection;
    animationDuration: number;
    onScrollEnd: () => void;
  }) {
    let nextOffset = 0,
      offest: 'offsetHeight' | 'offsetWidth' = 'offsetHeight',
      animation = 'translateY';

    if (direction === ScrollDirections.horizontal) {
      animation = 'translateX';
      offest = 'offsetWidth';
    }

    for (let i = 0; i < currentChildIndex; i++) {
      nextOffset += (childs[i] as HTMLDivElement)[offest];
    }

    pagesContainer.style.transform = `${animation}(${-nextOffset}px)`;

    setTimeout(() => {
      onScrollEnd();
    }, animationDuration);

    return this;
  }
}

export default UIScrollAnimation;

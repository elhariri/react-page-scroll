import { ScrollAxis, ScrollAxes } from './Scroll.types';

class UIScrollAnimation {
  static async fireScroll({
    currentChildIndex,
    childs,
    pagesContainer,
    direction,
    animationDuration,
  }: {
    currentChildIndex: number;
    childs: HTMLElement[];
    pagesContainer: HTMLElement;
    direction: ScrollAxis;
    animationDuration: number;
  }) {
    let nextOffset = 0,
      offest: 'offsetHeight' | 'offsetWidth' = 'offsetHeight',
      animation = 'translateY';

    if (direction === ScrollAxes.horizontal) {
      animation = 'translateX';
      offest = 'offsetWidth';
    }

    for (let i = 0; i < currentChildIndex; i++) {
      nextOffset += (childs[i] as HTMLDivElement)[offest];
    }

    pagesContainer.style.transform = `${animation}(${-nextOffset}px)`;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, animationDuration);
    });

    return this;
  }
}

export default UIScrollAnimation;

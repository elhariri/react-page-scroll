import { WheelEvent } from 'react';
import {
  ScrollControls,
  ScrollDirections,
  ScrollHandlerState,
  ScrollState,
  XdirectionState,
  YdirectionState,
} from './Scroll.types';
import { ScrollManager } from './ScrollManager';
import UIScrollAnimation from './UIScrollAnimation';

class SectionScrollHandler {
  readonly container: HTMLDivElement;

  private scrollUIState: ScrollHandlerState;

  private scrollManager: ScrollManager;

  private bindedShouldHandleWheelScroll;

  private bindedShouldHandleTouchScroll;

  private bindedHandleResize;

  private lastTouchMouve: Touch | null = null;

  constructor(container: HTMLDivElement, scrollUIState: ScrollHandlerState, scrollManager: ScrollManager) {
    this.container = container;
    this.scrollUIState = scrollUIState;
    this.scrollManager = scrollManager;

    this.bindedShouldHandleWheelScroll = this.shouldHandleWheelScrollEvent.bind(this) as unknown as (e: Event) => void;
    this.bindedShouldHandleTouchScroll = this.shouldHandleTouchScrollEvent.bind(this) as unknown as (e: Event) => void;

    this.bindedHandleResize = this.handleResize.bind(this);
  }

  private reinitializeScrollState() {
    this.scrollUIState.scrollState = {
      YDirection: 'stationary',
      XDirection: 'stationary',
    };
  }

  private handleResize() {
    let nextOffset = 0,
      offest: 'offsetHeight' | 'offsetWidth' = 'offsetHeight',
      animation = 'translateY';

    if (this.UIScrollStateCopy.direction === ScrollDirections.horizontal) {
      animation = 'translateX';
      offest = 'offsetWidth';
    }

    for (let i = 0; i < this.UIScrollStateCopy.currentChildIndex; i++) {
      nextOffset += (this.UIScrollStateCopy.childs[i] as HTMLDivElement)[offest];
    }

    this.UIScrollStateCopy.pagesContainer.style.transform = `${animation}(${-nextOffset}px)`;
  }

  private attachScrollListener() {
    const container = this.container;
    if (container) {
      container.addEventListener('wheel', this.bindedShouldHandleWheelScroll);

      container.parentElement?.addEventListener('touchmove', this.bindedShouldHandleTouchScroll);

      window.addEventListener('resize', this.bindedHandleResize);
    }
  }

  private removeScrollListener() {
    const container = this.container;
    if (container) {
      container.removeEventListener('wheel', this.bindedShouldHandleWheelScroll);

      container.parentElement?.removeEventListener('touchmove', this.bindedShouldHandleTouchScroll);
      //window.removeEventListener("resize", this.bindedHandleResize);
    }
  }

  private blockScroll() {
    this.scrollUIState.handlingScrolling = true;
    if (this.container) {
      this.container.removeEventListener('wheel', this.bindedShouldHandleWheelScroll);
    }
  }

  private enableScroll() {
    this.attachScrollListener();
    this.scrollUIState.handlingScrolling = false;
  }

  private captureOngoingWheelScrollState(wheelEvent: WheelEvent<HTMLDivElement>): ScrollState {
    const { direction } = this.scrollUIState,
      isVerticle = Math.abs(wheelEvent.deltaY) > Math.abs(wheelEvent.deltaX);

    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    if (isVerticle && direction === 'verticle') {
      if (Math.abs(wheelEvent.deltaY) > 1) {
        if (wheelEvent.deltaY > 0) {
          YDirection = 'down';
        } else {
          YDirection = 'up';
        }
      } else {
        YDirection = 'stationary';
      }
    } else if (!isVerticle && direction === 'horizontal') {
      if (Math.abs(wheelEvent.deltaX) > 1) {
        if (wheelEvent.deltaX > 0) {
          XDirection = 'left';
        } else {
          XDirection = 'right';
        }
      } else {
        XDirection = 'stationary';
      }
    }

    this.scrollUIState.scrollState = {
      XDirection,
      YDirection,
    };

    return this.scrollUIState.scrollState;
  }

  private captureOngoingTouchScrollState(touchEvent: TouchEvent): ScrollState {
    const { direction } = this.scrollUIState;
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    if (this.lastTouchMouve) {
      const { clientY, clientX } = touchEvent.touches[0];
      const YDelta = Math.abs(clientY - this.lastTouchMouve.clientY);
      const XDelta = Math.abs(clientX - this.lastTouchMouve.clientX);
      const isVerticle = YDelta > XDelta;
      if (isVerticle && direction === 'verticle') {
        if (touchEvent.touches[0].clientY > this.lastTouchMouve.clientY) {
          YDirection = 'up';
        } else {
          YDirection = 'down';
        }
      } else if (!isVerticle && direction === 'horizontal') {
        if (touchEvent.touches[0].clientX > this.lastTouchMouve.clientX) {
          XDirection = 'left';
        } else {
          XDirection = 'right';
        }
      }
    } else {
      this.lastTouchMouve = touchEvent.touches[0];
    }

    this.scrollUIState.scrollState = {
      XDirection,
      YDirection,
    };

    return this.scrollUIState.scrollState;
  }

  private setNextChild() {
    const { currentChildIndex, childs, scrollState } = this.scrollUIState;

    if (this.scrollUIState.direction === ScrollDirections.verticle && scrollState.YDirection !== 'stationary') {
      if (scrollState.YDirection === 'down') {
        if (currentChildIndex < childs.length - 1) {
          this.scrollUIState.currentChildIndex++;
          return true;
        } else {
          this.scrollUIState.lastTarget = null;
          return false;
        }
      } else {
        if (currentChildIndex > 0) {
          this.scrollUIState.currentChildIndex--;
          return true;
        } else {
          this.scrollUIState.lastTarget = null;
          return false;
        }
      }
    }
    this.scrollUIState.lastTarget = null;
    return false;
  }

  private onScrollEnd() {
    this.lastTouchMouve = null;

    const scrollTransfered = this.scrollManager.shouldCedeControlToChld(this.scrollUIState);

    if (!scrollTransfered) {
      this.reinitializeScrollState();
      this.enableScroll();
    } else {
      this.disable();
    }

    const { onAfterScroll, currentChildIndex, childs } = this.scrollUIState;

    if (onAfterScroll) {
      onAfterScroll({
        currentIndex: currentChildIndex,
        currentTarget: childs[currentChildIndex],
      });
    }
  }

  private shouldHandleWheelScrollEvent(event: WheelEvent<HTMLDivElement>) {
    this.captureOngoingWheelScrollState(event);
    this.handleScroll(event.target as HTMLElement);
  }

  private shouldHandleTouchScrollEvent(event: TouchEvent) {
    this.captureOngoingTouchScrollState(event);
    this.handleScroll(event.target as HTMLElement);
  }

  private handleScroll(currentTarget: HTMLElement) {
    const { handlingScrolling, lastTarget } = this.scrollUIState;

    if (
      !handlingScrolling &&
      !lastTarget?.isEqualNode(currentTarget) // this is added to prevent handling ongoing wheel gestures, we end up handling them twice
    ) {
      this.scrollUIState.lastTarget?.setAttribute('data-last-target', 'false');
      currentTarget.setAttribute('data-last-target', 'true');
      this.scrollUIState.lastTarget = currentTarget;

      this.blockScroll();

      const shouldScroll = this.setNextChild();

      if (shouldScroll) {
        this.scroll();
      } else if (
        !this.UIScrollStateCopy.isRoot &&
        this.scrollManager.shouldCedeControlToParent(this.UIScrollStateCopy)
      ) {
        this.disable();
      } else {
        this.enableScroll();
      }
    }
  }

  private initializeScroll() {
    if (this.scrollUIState.pagesContainer) {
      this.scrollUIState.pagesContainer.style.overflow = 'visible';
    }
  }

  private setScrollState(targetChildIndex: number) {
    const { currentChildIndex } = this.scrollUIState,
      { direction } = this.scrollUIState;
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    const isVerticle = direction === 'verticle';

    if (currentChildIndex > targetChildIndex) {
      if (isVerticle) {
        YDirection = 'up';
      } else {
        XDirection = 'left';
      }
    } else {
      if (isVerticle) {
        YDirection = 'down';
      } else {
        XDirection = 'right';
      }
    }

    this.scrollUIState.scrollState = {
      XDirection,
      YDirection,
    };

    return this.scrollUIState.scrollState;
  }

  scrollTo(target: number) {
    this.setScrollState(target);

    this.scrollUIState.lastTarget?.setAttribute('data-last-target', 'false');

    this.scrollUIState.currentChildIndex = target;
    this.scrollUIState.lastTarget = null;

    this.blockScroll();

    return this.scroll();
  }

  scroll() {
    const { onBeforeScroll, childs, currentChildIndex, animationDuration, direction, pagesContainer } =
      this.scrollUIState;

    if (onBeforeScroll) {
      onBeforeScroll({
        currentIndex: currentChildIndex,
      });
    }

    UIScrollAnimation.fireScroll({
      childs,
      currentChildIndex,
      animationDuration,
      direction,
      pagesContainer,
      onScrollEnd: this.onScrollEnd.bind(this),
    });
  }

  init(scrollControl: ScrollControls) {
    const { onScrollInit, scrollEnabled, currentChildIndex, childs } = this.scrollUIState;

    this.initializeScroll();

    if (scrollEnabled) {
      this.attachScrollListener();
    }

    if (this.container && onScrollInit) {
      onScrollInit({
        container: this.container,
        currentChildIndex,
        numberOfChilds: childs.length,
        scrollControl,
      });
    }

    return this;
  }

  disable() {
    this.scrollUIState.handlingScrolling = false;

    this.removeScrollListener();
  }

  get UIScrollStateCopy(): ScrollHandlerState {
    return {
      ...this.scrollUIState,
      scrollState: { ...this.scrollUIState.scrollState },
    };
  }
}

export default SectionScrollHandler;

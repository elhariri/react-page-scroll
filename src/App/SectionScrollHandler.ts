import { WheelEvent } from 'react';
import {
  //DataSetsAttributes,
  ScrollControls,
  ScrollAxes,
  ScrollHandlerState,
  XdirectionState,
  YdirectionState,
} from './Scroll.types';
import { WheelScrollEvent } from './Event/ScrollEvent';
//import { ScrollManager } from './ScrollManager';
import UIScrollAnimation from './UIScrollAnimation';

class SectionScrollHandler {
  readonly container: HTMLDivElement;

  private scrollUIState: ScrollHandlerState;

  //private scrollManager: ScrollManager;

  private wheelScrollEvent = new WheelScrollEvent();

  private lasHandledEventId = 0;

  private bindedShouldHandleWheelScroll;

  private bindedShouldHandleTouchScroll;

  private bindedHandleResize;

  constructor(container: HTMLDivElement, scrollUIState: ScrollHandlerState /* , scrollManager: ScrollManager */) {
    this.container = container;
    this.scrollUIState = scrollUIState;
    //this.scrollManager = scrollManager;

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

    if (this.UIScrollStateCopy.direction === ScrollAxes.horizontal) {
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
      container.addEventListener('wheel', this.bindedShouldHandleWheelScroll, { passive: false });

      container.parentElement?.addEventListener('touchmove', this.bindedShouldHandleTouchScroll, { passive: false });

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
    if (this.container) {
      this.container.removeEventListener('wheel', this.bindedShouldHandleWheelScroll);
    }
  }

  private enableScroll() {
    this.attachScrollListener();
  }

  private setNextChild() {
    const { currentChildIndex, childs, scrollState } = this.scrollUIState;

    if (this.scrollUIState.direction === ScrollAxes.vertical && scrollState.YDirection !== 'stationary') {
      if (scrollState.YDirection === 'down') {
        if (currentChildIndex < childs.length - 1) {
          this.scrollUIState.currentChildIndex++;
          return true;
        } else {
          return false;
        }
      } else {
        if (currentChildIndex > 0) {
          this.scrollUIState.currentChildIndex--;
          return true;
        } else {
          return false;
        }
      }
    }

    if (this.scrollUIState.direction === ScrollAxes.horizontal && scrollState.XDirection !== 'stationary') {
      if (scrollState.XDirection === 'left') {
        if (currentChildIndex < childs.length - 1) {
          this.scrollUIState.currentChildIndex++;
          return true;
        } else {
          return false;
        }
      } else {
        if (currentChildIndex > 0) {
          this.scrollUIState.currentChildIndex--;
          return true;
        } else {
          return false;
        }
      }
    }

    return false;
  }

  private onScrollEnd() {
    const scrollTransfered = false; //this.scrollManager.shouldCedeControlToChld(this.scrollUIState);

    if (!scrollTransfered) {
      this.reinitializeScrollState();
      this.enableScroll();
    } else {
      this.disable();
    }

    const { onScrollEnd, currentChildIndex } = this.scrollUIState;

    if (onScrollEnd) {
      onScrollEnd({
        currentIndex: currentChildIndex,
      });
    }
  }

  private shouldHandleWheelScrollEvent(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    //this.wheelScrollEvent.captureOngoingGesture(event);

    if (this.wheelScrollEvent.id > this.lasHandledEventId) {
      this.lasHandledEventId = this.wheelScrollEvent.id;
      this.handleScroll();
    }
  }

  private shouldHandleTouchScrollEvent(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();

    /*  this.captureOngoingTouchScrollState(event);
    this.touchScrollEvent.controlOngoingEvent();
    const { YDirection, XDirection } = this.scrollUIState.scrollState;

    const shouldScroll = YDirection !== 'stationary' || XDirection !== 'stationary';

    if (this.touchScrollEvent.id > this.lasHandledEventId && shouldScroll) {
      this.lasHandledEventId = this.touchScrollEvent.id; // last handled wheel direction
      this.handleScroll();
    } */
  }

  private handleScroll() {
    this.blockScroll();

    const shouldScroll = this.setNextChild();
    if (shouldScroll) {
      this.scroll();
    } else {
      if (
        !this.UIScrollStateCopy.isRoot /* &&
       this.scrollManager.shouldCedeControlToParent(this.UIScrollStateCopy) */
      ) {
        this.disable();
      } else {
        this.enableScroll();
      }
      this.reinitializeScrollState();
    }
  }
  /* 
  private initializeScroll() {
    if (this.scrollUIState.pagesContainer) {
      this.scrollUIState.pagesContainer.style.overflow = 'visible';
    }
  } */

  private setScrollState(targetChildIndex: number) {
    const { currentChildIndex } = this.scrollUIState,
      { direction } = this.scrollUIState;
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    const isvertical = direction === 'vertical';

    if (currentChildIndex > targetChildIndex) {
      if (isvertical) {
        YDirection = 'up';
      } else {
        XDirection = 'left';
      }
    } else {
      if (isvertical) {
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

    this.scrollUIState.currentChildIndex = target;

    this.blockScroll();

    return this.scroll();
  }

  scroll() {
    const { onScrollStart, childs, currentChildIndex, animationDuration, direction, pagesContainer } =
      this.scrollUIState;

    if (onScrollStart) {
      onScrollStart({
        targetIndex: currentChildIndex,
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
    console.log(scrollControl);
    /*  const { onScrollInit, scrollEnabled, currentChildIndex, childs } = this.scrollUIState;

    this.initializeScroll();

    if (scrollEnabled) {
      this.attachScrollListener();
    }

    for (let i = 0; i < childs.length; i++) {
      childs[i].setAttribute(DataSetsAttributes.reactScrollPage, 'true');
      childs[i].setAttribute(DataSetsAttributes.reactScrollPageIndex, i.toString());
    }

    if (this.container && onScrollInit) {
      onScrollInit({
        currentChildIndex,
        numberOfChilds: childs.length,
        scrollControl,
      });
    }

    return this; */
  }

  disable() {
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

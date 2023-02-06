import { WheelEvent } from 'react';
import {
  DataSetsAttributes,
  ScrollControls,
  ScrollDirections,
  ScrollHandlerState,
  ScrollState,
  XdirectionState,
  YdirectionState,
} from './Scroll.types';
import { TouchScrollEvent, WheelScrollEvent } from './ScrollEvent';
import { ScrollManager } from './ScrollManager';
import UIScrollAnimation from './UIScrollAnimation';

class SectionScrollHandler {
  readonly container: HTMLDivElement;

  private scrollUIState: ScrollHandlerState;

  private scrollManager: ScrollManager;

  private wheelScrollEvent = new WheelScrollEvent();

  private touchScrollEvent = new TouchScrollEvent();

  private lasHandledEventId = 0;

  private skippedFirstTouchs = 0;

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
    this.lastTouchMouve = null;
    this.skippedFirstTouchs = 0;
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

  private captureOngoingWheelScrollState(wheelEvent: WheelEvent<HTMLDivElement>): ScrollState {
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    const DeltaY = Math.abs(wheelEvent.deltaY),
      DeltaX = Math.abs(wheelEvent.deltaX);

    if (DeltaY > DeltaX) {
      if (DeltaY > 1) {
        if (wheelEvent.deltaY > 0) {
          YDirection = 'down';
        } else {
          YDirection = 'up';
        }
      }
    } else {
      if (DeltaX > 1) {
        if (wheelEvent.deltaX > 0) {
          XDirection = 'left';
        } else {
          XDirection = 'right';
        }
      }
    }

    this.scrollUIState.scrollState = {
      XDirection,
      YDirection,
    };

    return this.scrollUIState.scrollState;
  }

  private captureOngoingTouchScrollState(touchEvent: TouchEvent): ScrollState {
    const { currentChildIndex, childs } = this.scrollUIState;
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    //This lines are added to fine tune the behavior on the last page on mobile some times when you scroll down ig goes up because the forst touch events are somewhat unreliable
    // maybe this can be fine tuned in a better manner
    // either way the skipp first touched and sensitivity logic is added to acheive vetter predictability

    const isFirstOrLastChild = currentChildIndex == 0 || currentChildIndex == childs.length - 1;
    const touchesToSkip = isFirstOrLastChild ? 4 : 1;

    if (this.skippedFirstTouchs > touchesToSkip) {
      if (this.lastTouchMouve) {
        const { screenY, screenX } = touchEvent.changedTouches[0];
        const YDelta = screenY - this.lastTouchMouve.screenY;
        const XDelta = screenX - this.lastTouchMouve.screenX;
        const isvertical = Math.abs(YDelta) > Math.abs(XDelta);

        const sensitivity = 0;

        if (isvertical) {
          if (YDelta > sensitivity) {
            YDirection = 'up';
          } else if (YDelta < -sensitivity) {
            YDirection = 'down';
          }
        } else {
          if (XDelta > sensitivity) {
            XDirection = 'right';
          } else if (XDelta < -sensitivity) {
            XDirection = 'left';
          }
        }
      } else {
        this.lastTouchMouve = touchEvent.changedTouches[0];
      }
    } else {
      this.skippedFirstTouchs++;
    }

    this.scrollUIState.scrollState = {
      XDirection,
      YDirection,
    };

    return this.scrollUIState.scrollState;
  }

  private setNextChild() {
    const { currentChildIndex, childs, scrollState } = this.scrollUIState;

    if (this.scrollUIState.direction === ScrollDirections.vertical && scrollState.YDirection !== 'stationary') {
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

    if (this.scrollUIState.direction === ScrollDirections.horizontal && scrollState.XDirection !== 'stationary') {
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
    event.preventDefault();
    event.stopPropagation();

    this.captureOngoingWheelScrollState(event);
    this.wheelScrollEvent.controlOngoingEvent(event, this.scrollUIState.scrollState);
    if (this.wheelScrollEvent.id > this.lasHandledEventId) {
      this.lasHandledEventId = this.wheelScrollEvent.id;
      this.handleScroll();
    }
  }

  private shouldHandleTouchScrollEvent(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.captureOngoingTouchScrollState(event);
    this.touchScrollEvent.controlOngoingEvent();
    const { YDirection, XDirection } = this.scrollUIState.scrollState;

    const shouldScroll = YDirection !== 'stationary' || XDirection !== 'stationary';

    if (this.touchScrollEvent.id > this.lasHandledEventId && shouldScroll) {
      this.lasHandledEventId = this.touchScrollEvent.id; // last handled wheel direction
      this.handleScroll();
    }
  }

  private handleScroll() {
    this.blockScroll();

    const shouldScroll = this.setNextChild();
    if (shouldScroll) {
      this.scroll();
    } else {
      if (!this.UIScrollStateCopy.isRoot && this.scrollManager.shouldCedeControlToParent(this.UIScrollStateCopy)) {
        this.disable();
      } else {
        this.enableScroll();
      }
      this.reinitializeScrollState();
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

    for (let i = 0; i < childs.length; i++) {
      childs[i].setAttribute(DataSetsAttributes.reactScrollPage, 'true');
      childs[i].setAttribute(DataSetsAttributes.reactScrollPageIndex, i.toString());
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

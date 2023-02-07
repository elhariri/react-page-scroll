import { ScrollDirection, ScrollHandlerState, XdirectionState, YdirectionState } from '../Scroll.types';
import { ScrollManager } from '../ScrollManager';
import { ScrollPower, WheelScrollPower } from './ScrollEventPower/ScrollEventPower';

export type ScrollWithWheelEvent = globalThis.WheelEvent;

export type ScrollWithTouchEvent = TouchEvent;

export type ScrollEventTypes = ScrollWithWheelEvent | TouchEvent;

const initialScrollDirection: ScrollDirection = { YDirection: 'stationary', XDirection: 'stationary' };

abstract class ScrollEvent {
  protected hash = 0;

  protected abstract scrollPower: ScrollPower;

  protected timer: NodeJS.Timeout | null = null;

  abstract id: number | null;

  protected scrollControlFrequency = 100;

  protected ongoingScrollDirection: ScrollDirection = initialScrollDirection;

  protected scrollDirectionDetected = false;

  protected scrollManager = new ScrollManager();

  protected container: HTMLDivElement | null = null;

  protected bindedHandleScroll = this.handleScroll.bind(this);

  protected abstract detectScrollDirection(event: ScrollEventTypes): ScrollDirection | null;

  protected abstract captureOngoingGesture(event: ScrollEventTypes): void;

  protected abstract readyToScroll(): boolean;

  protected setScrollDirectionState(event: ScrollEventTypes): void {
    const detectedScrollDirection = this.detectScrollDirection(event);

    if (detectedScrollDirection) {
      this.ongoingScrollDirection = detectedScrollDirection;
      this.scrollDirectionDetected = true;
    }
  }

  protected setId() {
    this.hash = Date.now();
  }

  protected resetId() {
    this.hash = 0;
  }

  protected reinitializeState() {
    this.scrollPower.reinitializeState();
    this.hash = 0;
    this.ongoingScrollDirection = initialScrollDirection;
    this.scrollDirectionDetected = false;
  }

  abstract subscribe(container: HTMLDivElement): void;

  abstract unsubscribe(): void;

  addScrollContainer(container: HTMLDivElement, scrollUIState: ScrollHandlerState) {
    this.scrollManager.subscribe(container, scrollUIState);
  }

  handleScroll<Event extends ScrollEventTypes>(event: Event) {
    this.captureOngoingGesture(event);
    if (this.readyToScroll()) {
      this.scrollManager.handleScroll({ id: this.hash, scrollDiretion: this.ongoingScrollDirection });
    }
  }
}

export class WheelScrollEvent extends ScrollEvent {
  protected scrollPower: ScrollPower = new WheelScrollPower();

  protected detectScrollDirection(wheelEvent: ScrollWithWheelEvent): ScrollDirection {
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

    return {
      XDirection,
      YDirection,
    };
  }

  protected readyToScroll() {
    return (
      (this.ongoingScrollDirection.XDirection !== 'stationary' && this.scrollPower.didReachMaxPower.X) ||
      (this.ongoingScrollDirection.YDirection !== 'stationary' && this.scrollPower.didReachMaxPower.Y)
    );
  }

  protected captureOngoingGesture(event: ScrollWithWheelEvent): void {
    this.scrollPower.analyzePower(event);
    this.setScrollDirectionState(event);
    console.log('FIRED');
    if (this.scrollPower.isNewEvent || this.hash === 0) {
      this.hash = Date.now();
      this.scrollPower.handleNewEvent();
    }

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (this.readyToScroll()) {
        this.reinitializeState();
      }
    }, this.scrollControlFrequency);
  }

  get id() {
    return this.hash || 0;
  }

  subscribe(): void {
    window.addEventListener('wheel', this.bindedHandleScroll);
  }

  unsubscribe(): void {
    if (this.container) {
      this.container.removeEventListener('wheel', this.bindedHandleScroll);
    }
  }
}

/* export class TouchScrollEvent extends ScrollEvent {
  private skippedFirstTouchs = 0;

  private lastTouchEvent: Touch | null = null;

  protected detectScrollDirection(touchEvent: TouchEvent) {
    let YDirection: YdirectionState = 'stationary',
      XDirection: XdirectionState = 'stationary';

    //This lines are added to fine tune the behavior on the last page on mobile some times when you scroll down ig goes up because the forst touch events are somewhat unreliable
    // maybe this can be fine tuned in a better manner
    // either way the skipp first touched and sensitivity logic is added to acheive vetter predictability

    const touchesToSkip = 4;

    if (this.skippedFirstTouchs > touchesToSkip) {
      if (this.lastTouchEvent) {
        const { screenY, screenX } = touchEvent.changedTouches[0];
        const YDelta = screenY - this.lastTouchEvent.screenY;
        const XDelta = screenX - this.lastTouchEvent.screenX;
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
        return {
          XDirection,
          YDirection,
        };
      } else {
        this.lastTouchEvent = touchEvent.changedTouches[0];
      }
    } else {
      this.skippedFirstTouchs++;
    }

    return null;
  }

  captureOngoingGesture(): void {
    if (this.hash === 0) {
      this.setId();
    }

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.hash = 0;
    }, this.scrollControlFrequency);
  }

  get id() {
    return this.hash || 0;
  }
} */

export const wheelScrollEvent = new WheelScrollEvent();

export default ScrollEvent;

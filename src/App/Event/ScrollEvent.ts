import { ScrollDirection, ScrollHandlerState } from '../Scroll.types';
import { ScrollManager } from '../ScrollManager';
import { ScrollPower, WheelScrollPower } from './ScrollEventPower/ScrollEventPower';

export type ScrollWithWheelEvent = globalThis.WheelEvent;

export type ScrollWithTouchEvent = TouchEvent;

export type ScrollEventTypes = ScrollWithWheelEvent | TouchEvent;

const initialScrollDirection: ScrollDirection = 'stationary';

abstract class ScrollEvent {
  protected hash = 0;

  protected abstract scrollPower: ScrollPower;

  protected timer: NodeJS.Timeout | null = null;

  abstract id: number | null;

  protected scrollControlFrequency = 30;

  protected ongoingScrollDirection: ScrollDirection = initialScrollDirection;

  protected scrollDirectionDetected = false;

  protected scrollManager = new ScrollManager();

  protected bindedHandleScroll = this.handleScroll.bind(this);

  protected handlingScroll = false;

  protected abstract detectScrollDirection(event: ScrollEventTypes): ScrollDirection;

  protected abstract captureOngoingGesture(event: ScrollEventTypes): void;

  protected abstract readyToScroll(): boolean;

  protected setScrollDirectionState(event: ScrollEventTypes): void {
    const detectedScrollDirection = this.detectScrollDirection(event);

    if (detectedScrollDirection !== 'stationary') {
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

  abstract subscribe(): void;

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

  protected timer: NodeJS.Timeout | null = null;

  protected detectScrollDirection(wheelEvent: ScrollWithWheelEvent): ScrollDirection {
    let direction: ScrollDirection = 'stationary';

    const DeltaY = Math.abs(wheelEvent.deltaY),
      DeltaX = Math.abs(wheelEvent.deltaX);

    if (DeltaY > DeltaX) {
      if (DeltaY > 1) {
        if (wheelEvent.deltaY > 0) {
          direction = 'down';
        } else {
          direction = 'up';
        }
      }
    } else {
      if (DeltaX > 1) {
        if (wheelEvent.deltaX > 0) {
          direction = 'left';
        } else {
          direction = 'right';
        }
      }
    }

    return direction;
  }

  protected readyToScroll() {
    return this.scrollPower.didReachMaxPower;
  }

  protected captureOngoingGesture(event: ScrollWithWheelEvent): void {
    this.scrollPower.analyzePower(event);
    this.setScrollDirectionState(event);

    const newYEvent = this.scrollPower.isNewEvent.Y;
    const newXEvent = this.scrollPower.isNewEvent.X;

    if (newYEvent || newXEvent || this.hash === 0) {
      this.hash = Date.now();
      this.scrollPower.handleNewEvent();
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      if (this.scrollPower.didReachMaxPower) {
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
    window.removeEventListener('wheel', this.bindedHandleScroll);
  }
}

export const wheelScrollEvent = new WheelScrollEvent();

export default ScrollEvent;

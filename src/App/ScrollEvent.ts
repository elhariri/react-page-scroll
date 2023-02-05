import { WheelEvent } from 'react';
import { ScrollState } from './Scroll.types';

type ScrollEventTypes = WheelEvent<HTMLDivElement> | TouchEvent;

abstract class ScrollEvent {
  protected hasReachedMaxPower = false;

  protected hash = 0;

  protected power = 0;

  protected timer: NodeJS.Timeout | null = null;

  protected newEvent = false;

  abstract id: number | null;

  abstract controlOngoingEvent(event: ScrollEventTypes, scrollState?: ScrollState): void;

  protected setId() {
    this.hash = Date.now();
  }

  protected resetId() {
    this.hash = 0;
  }
}

export class WheelScrollEvent extends ScrollEvent {
  protected isMaxPower(event: WheelEvent<HTMLDivElement>, scrollState: ScrollState): void {
    let currentEventPower = 0;

    if (scrollState.YDirection !== 'stationary') {
      currentEventPower = Math.abs(event.deltaY);
    } else if (scrollState.XDirection !== 'stationary') {
      currentEventPower = Math.abs(event.deltaX);
    }

    if (!this.hasReachedMaxPower && currentEventPower < this.power) {
      this.hasReachedMaxPower = true;
    } else if (this.hasReachedMaxPower && currentEventPower > this.power) {
      this.newEvent = true;
    }

    this.power = currentEventPower;
  }

  controlOngoingEvent(event: WheelEvent<HTMLDivElement>, scrollState: ScrollState): void {
    this.isMaxPower(event, scrollState);

    if (this.newEvent || this.hash === 0) {
      this.hash = Date.now();
      this.hasReachedMaxPower = false;
      this.newEvent = false;
    }

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (this.hasReachedMaxPower) {
        this.hasReachedMaxPower = false;
        this.power = 0;
        this.hash = 0;
      }
    }, 60);
  }

  get id() {
    return this.hash || 0;
  }
}

export class TouchScrollEvent extends ScrollEvent {
  controlOngoingEvent(): void {
    if (this.hash === 0) {
      this.setId();
    }

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.hash = 0;
    }, 60);
  }

  get id() {
    return this.hash || 0;
  }
}

export default ScrollEvent;

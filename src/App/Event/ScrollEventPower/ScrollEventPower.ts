import { ScrollEventTypes, ScrollWithWheelEvent } from '../ScrollEvent';
import { ScrollAxisPower, WheelScrollAxisPower } from './ScrollEventPowerOnAxis';

export abstract class ScrollPower {
  protected abstract XAxisPowerControl: ScrollAxisPower;

  protected abstract YAxisPowerControl: ScrollAxisPower;

  protected XPower = 0;

  protected YPower = 0;

  abstract analyzePower(event: ScrollEventTypes): void;

  get isNewEvent() {
    return { X: this.XAxisPowerControl.isNewEvent, Y: this.YAxisPowerControl.isNewEvent };
  }

  reinitializeState(): void {
    this.XAxisPowerControl.reinitializeState();
    this.YAxisPowerControl.reinitializeState();

    this.XPower = 0;
    this.YPower = 0;
  }

  handleNewEvent() {
    this.XAxisPowerControl.handleNewEvent();
    this.YAxisPowerControl.handleNewEvent();
  }

  get didReachMaxPower() {
    if (this.XAxisPowerControl.maxAxisScrollPower > this.YAxisPowerControl.maxAxisScrollPower) {
      return this.XAxisPowerControl.didReachMaxPower;
    } else {
      return this.YAxisPowerControl.didReachMaxPower;
    }
  }
}

export class WheelScrollPower extends ScrollPower {
  protected XAxisPowerControl = new WheelScrollAxisPower();

  protected YAxisPowerControl = new WheelScrollAxisPower();

  analyzePower(event: ScrollWithWheelEvent) {
    this.XPower = this.XAxisPowerControl.analyzePower(event.deltaX);

    this.YPower = this.YAxisPowerControl.analyzePower(event.deltaY);
  }
}

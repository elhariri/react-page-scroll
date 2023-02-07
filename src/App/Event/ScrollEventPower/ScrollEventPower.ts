import { ScrollEventTypes, ScrollWithWheelEvent } from '../ScrollEvent';
import { ScrollAxisPower, WheelScrollAxisPower } from './ScrollEventPowerOnAxis';

export abstract class ScrollPower {
  protected abstract XAxisPowerControl: ScrollAxisPower;

  protected abstract YAxisPowerControl: ScrollAxisPower;

  protected XPower = 0;

  protected YPower = 0;

  abstract analyzePower(event: ScrollEventTypes): void;

  get isNewEvent() {
    return this.XAxisPowerControl.isNewEvent || this.YAxisPowerControl.isNewEvent;
  }

  reinitializeState(): void {
    this.XAxisPowerControl.reinitializeState();
    this.YAxisPowerControl.reinitializeState();
  }

  handleNewEvent() {
    this.XAxisPowerControl.handleNewEvent();
    this.YAxisPowerControl.handleNewEvent();
  }

  get didReachMaxPower() {
    return { X: this.XAxisPowerControl.didReachMaxPower, Y: this.YAxisPowerControl.didReachMaxPower };
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

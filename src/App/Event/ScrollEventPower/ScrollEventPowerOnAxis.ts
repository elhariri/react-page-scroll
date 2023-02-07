export abstract class ScrollAxisPower {
  protected power = 0;

  protected newEvent = false;

  protected hasReachedMaxPower = false;

  abstract analyzePower(delta: number): number;

  reinitializeState(): void {
    this.hasReachedMaxPower = false;
    this.power = 0;
  }

  handleNewEvent() {
    this.hasReachedMaxPower = false;
    this.newEvent = false;
  }

  get isNewEvent() {
    return this.newEvent;
  }

  get didReachMaxPower() {
    return this.hasReachedMaxPower;
  }
}

export class WheelScrollAxisPower extends ScrollAxisPower {
  analyzePower(delta: number): number {
    let currentEventPower = 0;

    currentEventPower = Math.abs(delta);

    if (!this.hasReachedMaxPower && currentEventPower < this.power) {
      this.hasReachedMaxPower = true;
    } else if (this.hasReachedMaxPower && currentEventPower > this.power) {
      this.newEvent = true;
    }

    this.power = currentEventPower;

    return currentEventPower;
  }
}

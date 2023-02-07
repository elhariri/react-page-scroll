export abstract class ScrollAxisPower {
  protected newEvent = false;

  protected hasReachedMaxPower = false;

  protected maxPower = 0;

  abstract analyzePower(delta: number): number;

  reinitializeState(): void {
    this.hasReachedMaxPower = false;
    this.maxPower = 0;
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

  get maxAxisScrollPower() {
    return this.maxPower;
  }
}

export class WheelScrollAxisPower extends ScrollAxisPower {
  analyzePower(delta: number): number {
    let currentEventPower = 0;

    currentEventPower = Math.abs(delta);

    this.maxPower = Math.max(this.maxPower, currentEventPower);

    if (!this.hasReachedMaxPower && currentEventPower < this.maxPower) {
      this.hasReachedMaxPower = true;
    } else if (this.hasReachedMaxPower && currentEventPower > this.maxPower) {
      this.newEvent = true;
    }

    return currentEventPower;
  }
}

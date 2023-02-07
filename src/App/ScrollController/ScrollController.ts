import { WheelScrollEvent } from '../Event/ScrollEvent';
import { ScrollHandlerState } from '../Scroll.types';

class ScrollController {
  private wheelScrollEvent = new WheelScrollEvent();

  addScrollContainer(container: HTMLDivElement, scrollUIState: ScrollHandlerState) {
    this.wheelScrollEvent.addScrollContainer(container, scrollUIState);
  }

  subscribe() {
    this.wheelScrollEvent.subscribe();
  }

  unsubscribe() {
    this.wheelScrollEvent.unsubscribe();
  }
}

export default ScrollController;

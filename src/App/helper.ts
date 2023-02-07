import { ScrollDirection } from './Scroll.types';

export function isVerticalDirection(scrollDirection: ScrollDirection) {
  return ['up', 'down'].includes(scrollDirection);
}

export function isHorizontalDirection(scrollDirection: ScrollDirection) {
  return ['right', 'left'].includes(scrollDirection);
}

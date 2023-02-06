import { ScrollDirections, ScrollHandlerState, ScrollManagerSubscribeOptions } from '../App/Scroll.types';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ScrollingSectionProps extends ScrollManagerSubscribeOptions {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  width?: string;
  height?: string;
}

export type PageScrollProps = Omit<ScrollingSectionProps, 'scrollEnabled' | 'isRoot'>;

export { ScrollHandlerState, ScrollDirections };

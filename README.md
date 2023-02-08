# React Page Scroll

A simple React library for full page scrolling page by page.
[Click here for a Demo!](http://react-page-scroll-demo.s3-website-us-east-1.amazonaws.com/)

![enter image description here](https://my-public-resources.s3.amazonaws.com/images/reactpagescroll.png)

## Installation

Using npm :

    npm install react-page-scroll

Using yarn :

    yarn add react-page-scroll

## Features

- Full page horizontal and vertical scroll
- Works on Touchscreens (Mobile/Tablets) and Desktop
- Nested scroll
- Easy API
- Hooks
- Lightweight (12.6 kB)
- Fluid CSS based animation

**Notice:** When using a mobile device and scrolling within a nested scroll section, weak user gestures may result in no scrolling. A fix is in development.

## Usage

### Simple example:

    import  React  from  'react';
    import  ReactPageScroll  from  'react-page-scroll';

    const  SimpleExample  = () => {
        return (<PageScroll width="100vw" height="100vh">
    			<div id="page1" className='page'></div>
    			<div id="page2" className='page'></div>
    	    </PageScroll>)
    };

    export  default  SimpleExample;

### Demo : [Simple scroll](http://react-page-scroll-demo.s3-website-us-east-1.amazonaws.com/)

### Nested example:

this is nested scroll example where the container scrolls vertically and the nested scroll on page 2 scrolls horizontally:

    import  React  from  'react';
    import  PageScroll, { NestedPageScroll }  from  'react-page-scroll';

    const  SimpleNestedExample  = () => {
        return (<PageScroll width="100vw" height="100vh">
    		<NestedPageScroll direction="horizontal" width="100vw" height="100vh">
    			<div id="page1-1" className='page'></div>
    			<div id="page1-2" className='page'></div>
    		</NestedPageScroll>
    		<div id="page2" className='page'></div>
    	    </PageScroll>)
    };

    export  default  SimpleNestedExample;

### Demo : [Nested scroll](http://react-page-scroll-demo.s3-website-us-east-1.amazonaws.com/demo3)

## Documentation

### Content:

- [PageScroll](#1-pagescroll);
- [NestedPageScroll](#2-nestedpagescroll);
- [Props](#3-props)

<br>

### 1. PageScroll:

**Type: (children: ReactNode, Props: [PageScrollProps](#3-props)) => ReactNode**
<br>
_\<PageScroll>_ is a higher level container for enabling scroll. you can set the scroll direction as horizontal or vertical, the animation duration in ms, the css animation easing and the width and height of the container. You can find more details on the [Props](#3-props) section.

_\<PageScroll>_ automatically identifies its direct children and designates them as pages for scrolling from or to. This behavior was intended to make its usage simpler. So don't put anything that you don't consider a page as a direct child of _\<PageScroll>_.

_\<PageScroll>_ supports nested scroll but through the [_\<NestedPageScroll>_ ](#2-pagescroll)component. Using _\<PageScroll>_ inside itself will cause an unintended behavior. Also using [_\<NestedPageScroll>_](#2-pagescroll) outside of a _\<PageScroll>_ will throw an error.

**Example:**

    import  React  from  'react';
    import  PageScroll from  'react-page-scroll';

    const ScrollingPages = () => {
    	return (<PageScroll width="100vw" height="100vh">
    		    <div id="page1" className='page'></div>
    		    <div id="page2" className='page'></div>
    	        </PageScroll>)
    }

<br>

### 2. NestedPageScroll:

**Type: (children: ReactNode, Props: [PageScrollProps](#3-props)) => ReactNode**
<br>
_\<NestedPageScrol>_ is almost identical to [_\<pageScroll>_](#1-pagescroll)). With two main differences:

1.  It is used to enable nested scroll inside a [_\<pageScroll>_](#1-pagescroll)) component in case you need a different direction (to switch from vertical scrolling to horizontal scrolling) or to create a different page indicator for the nested scroll.
2.  It can only be used inside a [_\<pageScroll>_](#1-pagescroll)). You can nest it inside itself as much as you want as long as you put all of them inside a [_\<pageScroll>_](#1-pagescroll)). In case you use it alone, it will throw an error.

**Example:**

    import  React  from  'react';
    import  PageScroll, { NestedPageScroll } from  'react-page-scroll';

    const ScrollingPages = () => {
    	return (<PageScroll width="100vw" height="100vh">
    			<NestedPageScroll direction="horizontal" width="100vw" height="100vh">
    				<div id="page1-1" className='page'></div>
    				<div id="page1-2" className='page'></div>
    			</NestedPageScroll>
    			<div id="page2" className='page'></div>
    	        </PageScroll>)
    }

<br>

### 3. Props:

1.  **direction (Optional)(default: _"vertical"_)**:
    - _description:_ **Sets the scroll direction**, supports only "vertical" or "horizontal"
    - _type:_ **"vertical" | "horizontal"**

<br>

2.  **width (Optional)(default: _"100vw"_)**:
    - _description:_ **Sets the width of the scroll container**, supports any valid CSS width value.
    - _type:_ **String**

<br>

3.  **height (Optional)(default: _"100vh"_)**:
    - _description:_ **Sets the height of the scroll container**, supports any valid CSS height value.
    - _type:_ **String**

<br>

4.  **animationDuration _~in ms_ (Optional)(default: _300_)**:
    - _description:_ **Sets the duration of the scroll animation in ms**. Supports any positive number
    - _type:_ **Number**

<br>

5.  **animationEasing (Optional)(default: _"cubic-bezier(0.76, 0, 0.24, 1)"_)**:
    - _description:_ **Sets the easing of the scroll animation**. Supports any valid CSS animation easing.
    - _type:_ **String**

**Hooks:** [check this demo for an example with hooks!](https://github.com/elhariri/react-page-scroll/blob/main/example/src/demos/NestedDemoWithPageIndicators.tsx) -- [Live preview](http://react-page-scroll-demo.s3-website-us-east-1.amazonaws.com/demo4)

6.  **onScrollInit (Optional):**
    - _description:_ A function that is **called whenever the component will be handling the scroll**. the function receives **the current child index, number of the scrolling container children and a scroll control object to programmatically launch a scroll** as a parameter. Notice: the same scroll control object will be given inside a [\<PageScroll>](#1-pagescroll) component.
    - _type:_ (args: { currentChildIndex: number; numberOfChilds: number; scrollControl: ScrollControls; }) => void
    - **scrollControl** has three methods:
      - **scrollTo**: that receives the target you want to scroll to;
      - **scrollToNext**: scroll into the next child depending on the direction you've set;
      - **scrollToPrevious**: scroll into the previous child depending on the direction you've set;

<br>

7.  **onScrollStart (Optional):**
    - _description:_ A function **fired when a scroll is about to happen**. the function **receives an object with the target index** as a parameter (the index of the page it will scroll into, relative to all its siblings) . this is particularly useful if you want to do something in parallel with the scroll like setting the page indicator.
    - _type:_ (args: { targetIndex: number }) => void

<br>

8.  **onScrollEnd (Optional):**
    - _description:_ A function **fired when a scroll has ended**. the function **receives an object with the current index** as a parameter (the index of the current showing page relative to all its siblings) . this is particularly useful if you want to do something after a scroll has ended.
    - _type:_ (args: { currentIndex: number }) => void

<br>

9.  **onScrollCommandCede (Optional):**
    - _description:_ A function **fired when the scroll will no longer be handled by the [\<PageScroll>](#1-pagescroll) or the [\<NestedPageScroll>](#2-nestedpagescroll) component you passed the function into** as it is passing control to another child or parent scroll component. the function **receives an object with the last page index before ceding control** as a parameter.
    - _type:_ ({ container: HTMLElement; currentChildIndex: number; numberOfChilds: number; }) => void

<br>

## Contributing

Contribution is welcome. If you have an idea or found a bug, please open an issue. For code contributions, fork the repository and submit a pull request.

## License

React Page Scroll is licensed under the [MIT License](https://github.com/openai/react-page-scroll/blob/master/LICENSE).

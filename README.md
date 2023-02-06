# React Page Scroll

A simple React library for full page scrolling page by page.
[Click here for a Demo!](http://react-page-scroll-demo.s3-website-us-east-1.amazonaws.com/)

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
- Lightweight
- Fluid CSS based animation

**Notice:** When using a mobile device and scrolling within a nested scroll section, weak user gestures may result in no scrolling. A fix is in development.

## Usage

You can find the CSS of the following examples at the end of this section (Usage).

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

## Documentation

<br>

### Content:

- [PageScroll](#1-pagescroll);
- [NestedPageScroll](#2-pagescroll);
- [Props](#3-props)
  <br>
  <br>

### 1. PageScroll:

**Type: (children: ReactNode, Props: [PageScrollProps](#3-props)) => ReactNode**
<br>
_\<PageScroll>_ is a higher level container for enabling scroll. you can set the scroll direction as horizontal or vertical, the animation duration in ms, the css animation easing and the width and height of the container. You can find more details on the [Props](#3-props) section.

_\<PageScroll>_ automatically identifies its direct children and designates them as pages for scrolling from or to. This behavior was intended to make its usage simpler. So don't put anything that you don't consider a page as a direct child of _\<PageScroll>_.

_\<PageScroll>_ supports nested scroll but through the [_\<NestedPageScroll>_ ](#2-pagescroll)component. Using _\<PageScroll>_ inside itself will cause an unintended behavior. Also using [_\<NestedPageScroll>_](#2-pagescroll) outside of a _\<PageScroll>_ will throw an error.
<br>
**Example:**

    import  React  from  'react';
    import  PageScroll from  'react-page-scroll';

    const ScrollingPages = () => {
    	return (<PageScroll width="100vw" height="100vh">
    				<div id="page1" className='page'></div>
    				<div id="page2" className='page'></div>
    			</PageScroll>)
    }

<br><br>

### 2. NestedPageScroll:

**Type: (children: ReactNode, Props: [PageScrollProps](#3-props)) => ReactNode**
<br>
_\<NestedPageScrol>_ is almost identical to [_\<pageScroll>_](<(#1-pagescroll)>). With two main differences:

1.  It is used to enable nested scroll inside a [_\<pageScroll>_](<(#1-pagescroll)>) component in case you need a different direction (to switch from vertical scrolling to horizontal scrolling) or to create a different page indicator for the nested scroll.
2.  It can only be used inside a [_\<pageScroll>_](<(#1-pagescroll)>). You can nest it inside itself as much as you want as long as you put all of them inside a [_\<pageScroll>_](<(#1-pagescroll)>). In case you use it alone, it will throw an error.
    <br>

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

<br><br>

### 3. Props:

1.  **direction (Optional)(default: _"vertical"_)**:
    - _description:_ **Sets the scroll direction**, supports only "vertical" or "horizontal"
    - _type:_ **"vertical" | "horizontal"**
2.  **width (Optional)(default: _"100vw"_)**:
    - _description:_ **Sets the width of the scroll container**, supports any valid CSS width value.
    - _type:_ **String**
3.  **height (Optional)(default: _"100vh"_)**:
    - _description:_ **Sets the height of the scroll container**, supports any valid CSS height value.
    - _type:_ **String**
4.  **animationDuration _~in ms_ (Optional)(default: _300_)**:
    - _description:_ **Sets the duration of the scroll animation in ms**. Supports any positive number
    - _type:_ **Number**
5.  **animationEasing (Optional)(default: _"cubic-bezier(0.76, 0, 0.24, 1)"_)**:
    - _description:_ **Sets the easing of the scroll animation**. Supports any valid CSS animation easing.
    - _type:_ **String**

**Hooks:**

6.
7.
8.
9.

## Contributing

Contribution is welcome. If you have an idea or found a bug, please open an issue. For code contributions, fork the repository and submit a pull request.

## License

React Page Scroll is licensed under the [MIT License](https://github.com/openai/react-page-scroll/blob/master/LICENSE).

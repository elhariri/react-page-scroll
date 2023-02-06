# React Page Scroll

A simple React library for full page scrolling page by page.

## Installation

Using npm :

    npm install react-page-scroll

Using yarn :

    yarn add react-page-scroll`

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
        return (<div  className='title'>
    			    <ReactPageScroll>
    				    <div  className='page bg1'>
    					    <span>Page 1</span>
    				    </div>
    				    <div  className='page bg2'>
    					    <span>Page 2</span>
    				    </div>
    				    <div  className='page bg3 small-page'>
    					    <span>Page 3</span>
    				    </div>
    				    <div  className='page bg4'>
    					    <span>Page 4</span>
    				    </div>
    			    </ReactPageScroll>
    			</div>)
    };

    export  default  SimpleExample;

### Nested example:

this is nested scroll example where the container scrolls vertically and the nested scroll on page 2 scrolls horizontally:

    import  React  from  'react';
    import  ReactPageScroll, { NestedReactPageScroll }  from  'react-page-scroll';

    const  SimpleNestedExample  = () => {
        return (<div  className='title'>
    			    <ReactPageScroll>
    				    <div  className='page'>
    					    <span>Page 1</span>
    				    </div>
    				   <NestedReactPageScroll  direction='horizontal'>
    					    <div  className='page bg2'>
    						    <span>Page 2 1/2</span>
    					    <span  className='scroll-indicator'>Scroll to go right --{'>'}</span>
    					    </div>
    					    <div  className='page bg3'>
    						    <span>Page 2 2/2</span>
    					    </div>
    					</NestedReactPageScroll>
    				    <div  className='page small-page'>
    					    <span>Page 3</span>
    				    </div>
    				    <div  className='page'>
    					    <span>Page 4</span>
    				    </div>
    			    </ReactPageScroll>
    			</div>)
    };

    export  default  SimpleNestedExample;

### The CSS:

    .title {
      font-size: 6rem;
      font-family: poppins;
      text-align: center;
      color: white;
      background-color: rgb(29 78 216);
    }

    .page {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-shrink: 0;
    }

    .small-page {
      height: 50vh;
      background-color: yellowgreen;
    }

    .page span {
      margin: auto;
    }

    .scroll-indicator {
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: left;
      font-size: 1rem;
      font-weight: 400;
      padding-right: 10px;
    }

    .bg1 {
      background-color: rgb(29 78 216);
    }

    .bg2 {
      background-color: rgb(219 39 119);
    }

    .bg3 {
      background-color: rgb(220 38 38);
    }

    .bg4 {
      background-color: rgb(8 145 178);
    }

    .bg5 {
      background-color: rgb(147 51 234);
    }

    .bg6 {
      background-color: rgb(5 150 105);
    }

    @media (max-width: 1250px) {
      .title {
        font-size: 5rem;
      }
    }

## Documentation

### Content:

- [ReactPageScroll](#ReactPageScroll);
- NestedReactPageScroll;
- Props
- hooks

### ReactPageScroll (children: ReactNode, Props: [ReactPageScrollProps](#Props)):

\<ReactPageScroll> is a higher level container for enabling scroll. you can set the scroll direction as horizontal or vertical, the animation duration in ms, the css animation easing and the width and height of the container. You can find more details on the [Props](#props) section.

\<ReactPageScroll> Automatically identifies its direct children and designates them as pages for scrolling from or to. This behavior was intended to make its usage simpler. So don't put anything that you don't consider a page as a direct child of <ReactPageScroll>.

\<ReactPageScroll> supports nested scroll but through the \<NestedReactPageScroll> component. Using \<ReactPageScroll> inside itself will cause an unintended behavior. Also using \<NestedReactPageScroll> outside of a \<ReactPageScroll> will throw an error.

## Contributing

Contribution is welcome. If you have an idea or found a bug, please open an issue. For code contributions, fork the repository and submit a pull request.

## License

React Page Scroll is licensed under the [MIT License](https://github.com/openai/react-page-scroll/blob/master/LICENSE).

import React from 'react';

import ScrollingContainer, { NestedReactPageScroll } from 'react-page-scroll';

const NestedSimpleDemo = () => {
  return (
    <div className='title'>
      <ScrollingContainer>
        <div className='page bg1'>
          <span>Page 1</span>
        </div>
        <NestedReactPageScroll direction='horizontal'>
          <div className='page bg2'>
            <span>Page 2 1/2</span>
            <span className='scroll-indicator'>Scroll to go right --{'>'}</span>
          </div>
          <div className='page bg3'>
            <span>Page 2 2/2</span>
          </div>
        </NestedReactPageScroll>
        <div className='page bg4 small-page'>
          <span>Page 3</span>
        </div>
        <div className='page bg5'>
          <span>Page 4</span>
        </div>
      </ScrollingContainer>
    </div>
  );
};

export default NestedSimpleDemo;

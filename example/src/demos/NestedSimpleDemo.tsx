import React from 'react';
import PageScroll, { NestedPageScroll } from 'react-page-scroll';

const NestedSimpleDemo = () => {
  return (
    <div className='title'>
      <PageScroll>
        <div className='page bg1'>
          <span>Page 1</span>
        </div>
        <NestedPageScroll direction='horizontal'>
          <div className='page bg2'>
            <span>Page 2 1/2</span>
            <span className='scroll-indicator'>Scroll to go right --{'>'}</span>
          </div>
          <div className='page bg3'>
            <span>Page 2 2/2</span>
          </div>
        </NestedPageScroll>
        <div className='page bg4 small-page'>
          <span>Page 3</span>
        </div>
        <div className='page bg5'>
          <span>Page 4</span>
        </div>
      </PageScroll>
    </div>
  );
};

export default NestedSimpleDemo;

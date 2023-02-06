import React from 'react';

import ScrollingContainer from 'react-page-scroll';

const SimpleDemo = () => {
  return (
    <div className='title'>
      <ScrollingContainer>
        <div className='page bg1'>
          <span>Page 1</span>
        </div>
        <div className='page bg2'>
          <span>Page 2</span>
        </div>
        <div className='page bg3 small-page'>
          <span>Page 3</span>
        </div>
        <div className='page bg4'>
          <span>Page 4</span>
        </div>
      </ScrollingContainer>
    </div>
  );
};

export default SimpleDemo;

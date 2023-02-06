import { motion } from 'framer-motion';
import React, { useState } from 'react';

import ScrollingContainer from 'react-page-scroll';
import PageIndicatorContainer from '../components/PageIndicator/PageIndicator';

const bgColors = [
  'rgb(29 78 216)',
  'rgb(219 39 119)',
  'rgb(220 38 38)',
  'rgb(8 145 178)',
  'rgb(147 51 234)',
  'rgb(5 150 105)',
];

const DemoWithPageIndicators = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <motion.div
      className='title'
      animate={{
        backgroundColor: bgColors[currentPage],
      }}
    >
      <PageIndicatorContainer pagesNumber={6} selectedPage={currentPage} />
      <ScrollingContainer onScrollStart={({ targetIndex }) => setCurrentPage(targetIndex)}>
        <div className='page'>
          <span>Page 1</span>
        </div>
        <div className='page'>
          <span>Page 2</span>
        </div>
        <div className='page'>
          <span>Page 3</span>
        </div>
        <div className='page' style={{ height: '50vh', backgroundColor: 'yellowgreen' }}>
          <span>Page 4</span>
        </div>
        <div className='page'>
          <span>Page 5</span>
        </div>
        <div className='page'>
          <span>Page 6</span>
        </div>
      </ScrollingContainer>
    </motion.div>
  );
};

export default DemoWithPageIndicators;

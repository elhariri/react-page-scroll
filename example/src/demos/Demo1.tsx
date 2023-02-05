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

const Demo1 = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <motion.div
      className='title'
      style={{
        fontFamily: 'poppins',
        textAlign: 'center',
        color: 'white',
        backgroundColor: bgColors[0],
      }}
      animate={{
        backgroundColor: bgColors[currentPage],
      }}
    >
      <PageIndicatorContainer pagesNumber={6} selectedPage={currentPage} />
      <ScrollingContainer onBeforeScroll={({ currentIndex }) => setCurrentPage(currentIndex)}>
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 1</span>
        </div>
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 2</span>
        </div>
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 3</span>
        </div>
        <div style={{ width: '100vw', height: '50vh', backgroundColor: 'yellowgreen', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 4</span>
        </div>
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 5</span>
        </div>
        <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
          <span style={{ margin: 'auto' }}>Page 6</span>
        </div>
      </ScrollingContainer>
    </motion.div>
  );
};

export default Demo1;

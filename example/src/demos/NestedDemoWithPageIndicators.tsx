import { motion } from 'framer-motion';
import React, { useState } from 'react';

import ScrollingContainer, { NestedPageScroll } from 'react-page-scroll';
import PageIndicatorContainer from '../components/PageIndicator/PageIndicator';
import { NestedState } from '../components/PageIndicator/PageIndicator.types';

const bgColors = [
  'rgb(29 78 216)',
  'rgb(219 39 119)',
  'rgb(220 38 38)',
  'rgb(8 145 178)',
  'rgb(147 51 234)',
  'rgb(5 150 105)',
];

const NestedDemoWithPageIndicators = () => {
  const [nestedState, setNestedState] = useState<NestedState>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const setNestedtStateOnScrollInit = ({ currentChildIndex }: { currentChildIndex: number }) => {
    setNestedState({ currentIndex: currentChildIndex, numberOfChilds: 2 });
  };

  const setNestedtStateOnScrollStart = ({ targetIndex }: { targetIndex: number }) => {
    setNestedState({ currentIndex: targetIndex, numberOfChilds: 2 });
  };

  return (
    <motion.div
      className='title'
      animate={{
        backgroundColor: bgColors[currentPage],
      }}
    >
      <PageIndicatorContainer nestedScroll={nestedState} pagesNumber={6} selectedPage={currentPage} />
      <ScrollingContainer onScrollStart={({ targetIndex }) => setCurrentPage(targetIndex)}>
        <div className='page'>
          <span>Page 1</span>
        </div>
        <NestedPageScroll
          onScrollInit={setNestedtStateOnScrollInit}
          onScrollStart={setNestedtStateOnScrollStart}
          onScrollCommandChange={() => setNestedState(null)}
        >
          <div className='page bg2'>
            <span>Page 2 1/2</span>
          </div>
          <div className='page bg3'>
            <span>Page 2 2/2</span>
          </div>
        </NestedPageScroll>
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

export default NestedDemoWithPageIndicators;

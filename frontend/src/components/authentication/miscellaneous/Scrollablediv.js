import React, { useEffect, useRef } from 'react';

const ScrollableDiv = ({ children }) => {
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when component mounts or children change
    scrollableDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }, [children]);

  return (
    <div style={{ overflowY: 'scroll', maxHeight: '100%' }} ref={scrollableDivRef}>
      {children}
    </div>
  );
};

export default ScrollableDiv;

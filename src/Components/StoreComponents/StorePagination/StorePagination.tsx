import React from 'react';
import './StorePagination.scss';

const StorePagination = () => {
  return (
    <div className="store-pagination">
      <button className="page-button" disabled>
        &laquo; Prev
      </button>
      <button className="page-number active">1</button>
      <button className="page-number">2</button>
      <button className="page-number">3</button>
      <button className="page-number">4</button>
      <button className="page-number">5</button>
      <button className="page-button">Next &raquo;</button>
    </div>
  );
};

export default StorePagination;

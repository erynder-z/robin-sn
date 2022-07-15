import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { TailSpin } from 'react-loader-spinner';
import './FetchingIcon.css';

function FetchingIcon() {
  return (
    <div className="fetching">
      <TailSpin color="#ff79c6" height={50} width={50} ariaLabel="three-circles-rotating" />
    </div>
  );
}

export default FetchingIcon;

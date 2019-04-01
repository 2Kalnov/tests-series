import React from 'react';
import styles from './ErrorMessage.css';

const errorMessage = (props) => {
  return <p className="errorMessage">{props.message}</p>;
}

export default errorMessage;
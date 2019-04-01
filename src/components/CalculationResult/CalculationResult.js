import React from 'react';
import styles from './CalculationResult.css';

const calculationResult = (props) => {
  return <p>Искомая вероятность равна: <span className="calc-value">{props.value}</span></p>;
}

export default calculationResult;
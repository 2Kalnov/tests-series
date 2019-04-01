import React, { Component } from 'react';
import CalculationResult from '../CalculationResult/CalculationResult';
import ControlledInput from '../ControlledInput/ControlledInput';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { MoivreLaplasLocal } from '../../math/calculations';
import math from 'mathjs';
import styles from './MoivreLaplasDashboard.css';
import moivreLaplasFormula from '../../assets/images/moivreLaplas.png';

class MoivreLaplasDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      n: '',
      p: '',
      m: '',
      calculationResult: '',
      error: true,
      errorMessage: []
    }
  }

  handleNChange = (e) => {
    let n = e.target.value;
    if(Number.isNaN(Number.parseInt(n)))
      n = '';
    this.setState({n: n});
  }

  handleMChange = (e) => {
    let m = e.target.value;
    if(Number.isNaN(Number.parseInt(m)))
      m = '';
    this.setState({m: m});
  }

  handlePChange = (e) => { this.setState({p: e.target.value}) }

  clearState = () => {
    this.setState({n: '', m: '', p: '', error: true, errorMessage: [], calculationResult: ''});
  }

  calculate = (e) => {
    e.preventDefault();

    const isValidInt = (stringNum) => !Number.isNaN(Number.parseInt(stringNum));
    const isValidFloat = (stringNum) => !Number.isNaN(Number.parseFloat(stringNum));

    let error = false, errorMessage = [];
    let calculationResult = '';

    if(!isValidInt(this.state.n) || !isValidInt(this.state.m) || Number.parseInt(this.state.m) < 0 || !isValidFloat(this.state.p))
      error = true;
    
    if(error) {
      if(!isValidInt(this.state.n))
        errorMessage.push('Число испытаний n должно быть целым числом.');
      if(!isValidInt(this.state.m) || Number.parseInt(this.state.m))
        errorMessage.push('Число успехов m должно быть целым числом, большим либо равным 0.');
      if(!isValidFloat(this.state.p))
        errorMessage.push('Вероятность успеха должна быть дробным числом, значение которого лежит в границах [0.1; 0.9].');
    }
    else {
      const n = Number.parseInt(this.state.n);
      const p = Number.parseFloat(this.state.p);
      const npq = math.chain(n).multiply(math.bignumber(p)).multiply(math.subtract(1, math.bignumber(p))).done();

      if(n < 100 || math.smaller(p, 0.1) || math.larger(p, 0.9) || math.smaller(npq, 9))
        error = true;

      if(n < 100)
        errorMessage.push('Число испытаний n должно быть не меньше 100.');
      if(math.smaller(p, 0.1) || math.larger(p, 0.9))
        errorMessage.push('Вероятность успеха p должна лежать в границах [0.1; 0.9].');
      if(math.smaller(npq, 9))
        errorMessage.push('Произведение n*p*q должно быть больше либо равно 9.');
    }
    
    if(!error)
      calculationResult = MoivreLaplasLocal(Number.parseInt(this.state.n), Number.parseInt(this.state.m), Number.parseFloat(this.state.p));

    this.setState({error: error, errorMessage: errorMessage, calculationResult: calculationResult});
  }

  render() {
    return(
      <div className="dashboard-formula dashboard-formula-laplas">
        <h2 className="dashboard-formula-header">Расчёт вероятности с помощью локальной теоремы Муавра-Лапласа</h2>
        <span>Расчётные формулы: </span><img className="formula-image" src={moivreLaplasFormula} alt="Расчётная формула"/>
        <h4>Рекомендации по вычислению с помощью локальной теоремы Муавра-Лапласа</h4>
        <ul>
          <li>Число испытаний должно быть не меньше 100.</li>
          <li>Вероятность успеха p должна лежать в границах [0.1; 0.9].</li>
          <li>Произведение n*p*q должно быть больше либо равно 9.</li>
        </ul>
        <form onSubmit={this.calculate}>
          <ControlledInput 
            labelText="Число испытаний n: "
            value={this.state.n}
            handler={this.handleNChange}
          />

          <ControlledInput
            labelText="Число успехов m: "
            value={this.state.m}
            handler={this.handleMChange}
          />

          <ControlledInput
            labelText="Вероятность успеха p: "
            value={this.state.p}
            handler={this.handlePChange}
          />

          <input type="submit" value="Вычислить"/>
          <button type="button" className="clear-button" onClick={this.clearState}>Очистить всё</button>
        </form>

        {!this.state.error ? <CalculationResult value={this.state.calculationResult}/> : 
            this.state.errorMessage.map((message, index) => <ErrorMessage key={`message${index}`} message={message}/>)
        }
      </div>
    );
  }
}

export default MoivreLaplasDashboard;
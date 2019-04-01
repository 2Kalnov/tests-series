import React, { Component } from 'react';
import ControlledInput from '../ControlledInput/ControlledInput';
import CalculationResult from '../CalculationResult/CalculationResult';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { Bernoulli } from '../../math/calculations';
import { BernoulliBetween } from '../../math/calculations';
import styles from './BernoulliDashboard.css';
import bernoulliFormula from '../../assets/images/bernoulli.png';

class BernoulliDashboard extends Component{
  constructor(props) {
    super(props);

    this.state = {
      n: '',
      p: '',
      m: '',
      m1: '',
      m2: '',
      between: false,
      numberOfEventsOption: 'single',
      calculationResult: '',
      error: true,
      errorMessage: [],
    };
  }

  handleNChange = (e) => { 
    let n = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(n))
      n = '';
    this.setState({n: n.toString()}); 
  }

  handlePChange = (e) => { 
    let p = e.target.value;
    this.setState({p: p}); 
  }

  handleMChange = (e) => { 
    let m = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(m))
      m = '';
    this.setState({m: m.toString()}); 
  }

  handleM1Change = (e) => { 
    let m1 = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(m1))
      m1 = '';
    this.setState({m1: m1.toString()}); 
  }

  handleM2Change = (e) => { 
    let m2 = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(m2))
      m2 = '';
    this.setState({m2: m2.toString()}); 
  }

  handleBetweenCheck = (e) => { 
    this.setState({between: e.target.checked, m: null}); 
  }

  handleEventsOptionChange = (option) => {
    this.setState({numberOfEventsOption: option});
  }

  clearState = () => {
    this.setState({
      n: '',
      p: '',
      m: '',
      m1: '',
      m2: '',
      between: false,
      numberOfEventsOption: 'single',
      calculationResult: '',
      error: true,
      errorMessage: [],
    });
  }

  calculate = (e) => {
    e.preventDefault();
    let calculationResult = '', error = false, errorMessage = [];
    let pIsWrong = false;
    let nIsWrong = false;
    let anyMIsWrong = false;

    let p = Number.parseFloat(this.state.p);
    if(Number.isNaN(p) || p < 0 || p > 1 || this.state.p.includes(',')) 
      pIsWrong = true;
   
    let mList = [], mIntList = [];
    mList.push(this.state.m);
    if(this.state.between)
      mList.push(this.state.m1, this.state.m1);
    mList.forEach(el => {
      let num = Number.parseInt(el);
      mIntList.push(num);
      if(el === '' || num < 0)
        anyMIsWrong = true;
    });

    let n = Number.parseInt(this.state.n);
    nIsWrong = Number.isNaN(n) || n <= 0;
    
    if(pIsWrong || anyMIsWrong || nIsWrong)
      error = true;
    if(pIsWrong)
      errorMessage.push('Вероятность успеха должна находиться в промежутке от 0 до 1.');
    if(nIsWrong)
      errorMessage.push('Количество испытаний должно быть не меньше 1.');
    if(anyMIsWrong)
      errorMessage.push('Количество успехов должно быть целым числом.');
      
    if(!error)
      calculationResult = 
      !this.state.between ? Bernoulli(this.state.numberOfEventsOption, p, n, mIntList[0])
      : BernoulliBetween(p, n, mIntList[1], mIntList[2]);

    this.setState({calculationResult: calculationResult, error: error, errorMessage: errorMessage});
  }

  render() {
    const eventsOption = this.state.numberOfEventsOption;
    
    const numberOfEventsControls = [
      <span key='single' 
        className={eventsOption === 'single' ? 'active' : ''} 
        onClick={() => this.handleEventsOptionChange('single')}
      >Число успехов равно m</span>,
      <span key='more_than_or_equals' 
        className={eventsOption === 'more_than_or_equals' ? 'active' : ''} 
        onClick={() => this.handleEventsOptionChange('more_than_or_equals')}
      >Число успехов больше либо равно m</span>,
      <span key='less_than' 
        className={eventsOption === 'less_than' ? 'active' : ''} 
        onClick={() => this.handleEventsOptionChange('less_than')}
      >Число успехов меньше m</span>
    ];

    return (
      <div className="dashboard-formula dashboard-formula-bernoulli">
        <h2 className="dashboard-formula-header">Расчёт вероятности по формуле Бернулли</h2>
        <span>Расчётная формула: </span><img className="formula-image" src={bernoulliFormula} alt="Расчётная формула"/>
        <form onSubmit={this.calculate}>
          <label id="check-between-input">
            Расчёт вероятности между двумя значениями числа успехов 
            <input type="checkbox" name="between" checked={this.state.between} onChange={this.handleBetweenCheck}/>
          </label>

          <div className="eventsControls">
            {numberOfEventsControls}
          </div>

          <ControlledInput
            labelText="Значение n числа испытаний:" 
            value={this.state.n} 
            handler={this.handleNChange}
          />

          <ControlledInput
            labelText="Значение m числа успехов:"
            value={this.state.m}
            handler={this.handleMChange}
          />

          <ControlledInput
            labelText="Значение p вероятности успеха:"
            value={this.state.p}
            handler={this.handlePChange}
          />

          {this.state.between && 
            <React.Fragment>
              <ControlledInput
                labelText="Значение m1 числа успехов (левая граница):"
                value={this.state.m1}
                handler={this.handleM1Change}
              />

              <ControlledInput
                labelText="Значение m2 числа успехов (левая граница):"
                value={this.state.m2}
                handler={this.handleM2Change}
              />
            </React.Fragment>
          }
          <input type="submit" value="Вычислить"/>
          <button type="button" className="clear-button" onClick={this.clearState}>Очистить всё</button>
        </form>

        {!this.state.error ? <CalculationResult value={this.state.calculationResult}/> : 
          this.state.errorMessage.map((message, index) => <ErrorMessage message={message} key={`message${index}`}/>)
        }
      </div>
    );
  }

}

export default BernoulliDashboard;
import React, { Component } from 'react';
import ControlledInput from '../ControlledInput/ControlledInput';
import CalculationResult from '../CalculationResult/CalculationResult';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { Polynomial } from '../../math/calculations';
import polynomialFormula from '../../assets/images/polynomial.png';

class PolynomialDashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      n: '',
      k: '',
      m: new Map(),
      p: new Map(),
      calculationResult: '',
      error: true,
      errorMessage: []
    };
  }

  handleNChange = (e) => {
    let n = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(n))
      n = '';
    this.setState({n: n});
  }

  handleKChange = (e) => {
    this.adjustGroupLists();
    let k = Number.parseInt(e.target.value, 10);
    if(Number.isNaN(k))
      k = '';
    this.setState({k: k});

  }

  handleMChange = (e) => {
    let inputNumber = e.target.name.slice(-1);
    let groupSize = e.target.value;
    this.setState(state => {
      let mList = state.m;
      mList.set(inputNumber, groupSize);
      return {m: mList};
    });
  }

  handlePChange = (e) => {
    let inputNumber = e.target.name.slice(-1);
    let probabilityValue = e.target.value;

    this.setState(state => {
      let pList = state.p;
      pList.set(inputNumber, probabilityValue);
      return {p: pList};
    });
  }

  clearState = () => {
    this.setState({
      n: '',
      k: '',
      m: new Map(),
      p: new Map(),
      calculationResult: '',
      error: true,
      errorMessage: []
    });
  }

  renderMInputList = () => {
    let groupsNum = this.state.k;
    let inputList = new Array(groupsNum);

    for(let num = 1; num <= groupsNum; num += 1) {
      let input = (
        <label key={`m${num}`}>
          Количество объектов группы {num} m<sub>{`${num}`}</sub>: 
          <input type="text" value={this.state.m.get(num.toString())} onChange={this.handleMChange} name={`m${num}`}/>
        </label>
      );

      inputList.push(input);
    }
    
    return inputList;
  }

  renderPInputList = () => {
    let groupsNum = this.state.k;
    let inputList = new Array(groupsNum);

    for(let num = 1; num <= groupsNum; num += 1) {
      let input = (
        <label key={`m${num}`}>
          Вероятность p<sub>{`${num}`}</sub>: 
          <input type="text" value={this.state.p.get(num.toString())} onChange={this.handlePChange} name={`p${num}`}/>
        </label>
      );

      inputList.push(input);
    }
    return inputList;
  }

  adjustGroupLists = () => {
    let groupsNum = this.state.m.size;
    let newSize = this.state.k;
    this.setState(state => {
      let mList = this.state.m;
      let pList = this.state.p;
      for(let i = newSize; i <= groupsNum; i += 1) {
        pList.delete(i.toString());
        mList.delete(i.toString());
      }
      return {p: pList, m: mList};
    });
  }

  calculate = (e) => {
    e.preventDefault();
    let calculationResult = '';
    let error = false; 
    let errorMessage = [];

    let kIsWrong = Number.parseInt(this.state.k) === 0;

    let mSum = 0;
    let mValueList = [];
    let pValueList = [];

    let anyMIsWrong = false;
    let mList = this.state.m;
    mList.forEach((groupSize, groupNum) => {
      let groupSizeValue = Number.parseInt(groupSize);
      if(Number.isNaN(groupSizeValue))
        anyMIsWrong = true;
      else {
        if(groupSizeValue < 0)
          anyMIsWrong = true;
        mValueList.push(groupSizeValue); 
      }
    });

    mSum = mValueList.reduce((sum, groupSize) => {
      return sum + groupSize;
    }, 0);

    let anyPIsWrong = false;
    let pList = this.state.p;
    pList.forEach((probabilityValue) => {
      let pValue = Number.parseFloat(probabilityValue);
      if(Number.isNaN(pValue)) {
        anyPIsWrong = true;
      }
      else {
        if(pValue < 0 || pValue > 1)
          anyPIsWrong = true;
        pValueList.push(pValue);
      }
    })

    if(anyPIsWrong || anyMIsWrong || this.state.n <= 0 || mSum !== this.state.n || kIsWrong)
      error = true;

    if(anyPIsWrong) 
      errorMessage.push('Вероятность успеха - число от 0 до 1, десятичная часть которого записывается через точку.');

    if(anyMIsWrong)
      errorMessage.push('Количество объектов группы (m) должно быть не меньше 0.');
    
    if(this.state.n <= 0)
      errorMessage.push('Общее количество объектов должно быть не меньше 1.');

    if(mSum !== this.state.n) 
      errorMessage.push('Сумма количества объектов в группе не равна общему числу объектов.');

    if(kIsWrong)
      errorMessage.push('Количество групп объектов должно быть не меньше 1.');

    if(!error)
    {
      calculationResult = Polynomial(this.state.n, mValueList, pValueList);
    }
    
    this.setState({error: error, errorMessage: errorMessage, calculationResult: calculationResult});
  }

  render() {
    return (
      <div className="dashboard-formula"> 
        <h2 className="dashboard-formula-header">Расчёт вероятности по полиномиальной формуле</h2>
        <span>Расчётная формула: </span><img className="formula-image" src={polynomialFormula} alt="Расчётная формула"/>
        <form onSubmit={this.calculate}>
          <ControlledInput
            labelText="Общее количество объектов: " 
            value={this.state.n} 
            handler={this.handleNChange}
          />

          <ControlledInput
            labelText="Количество групп объектов k: " 
            value={this.state.k} 
            handler={this.handleKChange}
          />

          {this.renderMInputList()}
          {this.renderPInputList()}

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

export default PolynomialDashboard;
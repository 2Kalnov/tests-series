import React, {Component} from 'react';
import CalculationDashboard from '../../containers/CalculationDashboard/CalculationDashboard';
import styles from './Layout.css';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      probabilityFormula: 'bernoulli'
    }
  }

  handleFormulaChoice = (formula) => {
    this.setState({probabilityFormula: formula});
  }

  render() {
    const formulaName = {'bernoulli': 'формулы Бернулли', 'moivreLaplas': 'локальной теормы Муавра-Лапласа', 'polynomial': 'полиномиальной формулы'};

    return (
      <div className="layout">
        <h1 className="page-header">Расчёт вероятности событий с помощью {formulaName[this.state.probabilityFormula]}</h1>
        <CalculationDashboard formulaHandler={this.handleFormulaChoice} formula={this.state.probabilityFormula}/>
      </div>
    );
  }
}

export default Layout;
import React, { Component } from 'react';
import BernoulliDashboard from '../../components/BernoulliDashboard/BernoulliDashboard';
import PolynomialDashboard from '../../components/PolynomialDashboard/PolynomialDashboard';
import styles from './CalculationDashboard.css';
import MoivreLaplasDashboard from '../../components/MoivreLaplasDashboard/MoivreLaplasDashboard';

class CalculationDashboard extends Component{
  constructor(props) {
    super(props);

    this.state = {
      activeFormula: 'bernoulli'
    };
  }

  handleFormulaChange = (formula) => {
    this.props.formulaHandler(formula);
    this.setState({activeFormula: formula});
  }

  render() {
    let formulaDashboard;
    switch(this.props.formula) {
      case 'bernoulli':
        formulaDashboard = <BernoulliDashboard/>
        break;
      case 'polynomial':
        formulaDashboard = <PolynomialDashboard/>
        break;
      case 'moivreLaplas':
        formulaDashboard = <MoivreLaplasDashboard/>
        break; 
        
      default:
        formulaDashboard = <BernoulliDashboard/>
    }

    const formulas = [
      <span key='bernoulli' className={this.state.activeFormula === 'bernoulli' ? 'active' : ''} onClick={() => {this.handleFormulaChange('bernoulli')}}>Формула Бернулли</span>,
      <span key='polynomial' className={this.state.activeFormula === 'polynomial' ? 'active' : ''} onClick={() => {this.handleFormulaChange('polynomial')}}>Полиномиальная формула</span>,
      <span key='moivreLaplas' className={this.state.activeFormula === 'moivreLaplas' ? 'active' : ''} onClick={() => {this.handleFormulaChange('moivreLaplas')}}>Локальная теорема Муавра-Лапласа</span>
    ];

    return (
      <React.Fragment>
        <div className="formulasContainer flexbox">{formulas}</div>
        {formulaDashboard}
      </React.Fragment>
    );
  }
  
}

export default CalculationDashboard;
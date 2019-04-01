import React, { Component } from 'react';
import Layout from './components/Layout/Layout'
import CalculationDashboard from './containers/CalculationDashboard/CalculationDashboard'
import './App.css';

class App extends Component {
  render() {
    return (
      <Layout>
        <CalculationDashboard/>
      </Layout>
    );
  }
}

export default App;

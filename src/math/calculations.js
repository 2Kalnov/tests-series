import * as math from 'mathjs';
math.config({number: 'number', precision: 100000});

const outputFormatSettings = {notation: 'fixed', precision: 10};

const countCombinations = (n, m) => {
  const big_n = math.bignumber(n);
  const big_m = math.bignumber(m);

  let numerator = math.factorial(big_n);
  let denominator = math.multiply(math.factorial(big_m), math.factorial(math.subtract(big_n, big_m)));

  let combinations = math.divide(numerator, denominator);

  return combinations;
}

const countGaussianDistributionDensity = (x) => {
  let constFactor = math.divide(1, math.sqrt(math.multiply(2, math.pi)));
  let exponent = math.exp(math.divide(math.unaryMinus(math.pow(x, 2)), 2));
  let densityFunctionValue = math.multiply(constFactor, exponent);

  return densityFunctionValue;
}

const countWithBernoulliFormula = (numberOfEventsOption, input_p, n, m) => {
  const p = math.bignumber(input_p);
  const q = math.bignumber(1 - input_p);

  let result = new math.bignumber();
  let numberOfEventsList;

  switch(numberOfEventsOption) {
    case 'single':
      result = math.chain(countCombinations(n, m)).multiply(math.pow(p, m)).multiply(math.pow(q, math.subtract(n, m))).done();
      break;
    case 'less_than':
      numberOfEventsList = new Array();
      for(let num = 0; num < m; num += 1) {
        numberOfEventsList.push(num);
      }

      result = countListWithBernoulliFormula(numberOfEventsList, p, n);
      break;
    case 'more_than_or_equals':
      numberOfEventsList = new Array();
      for(let num = m; num <= Number(n); num += 1) {
        numberOfEventsList.push(num);
      }
      result = countListWithBernoulliFormula(numberOfEventsList, p, n);
      break;
    default:
      result = math.chain(countCombinations(n, m)).multiply(math.pow(p, m)).multiply(math.pow(q, math.subtract(n, m))).done();
  }
  return result;
}

const countWithBernoulliFormulaBetweenTwoValues = (p, n, m1, m2) => {
  const numberOfEventsList = new Array();

  for(let num = m1; num <= m2; num += 1) {
    numberOfEventsList.push(num);
  }
  return math.format(countListWithBernoulliFormula(numberOfEventsList, p, n), outputFormatSettings);
}

const countListWithBernoulliFormula = (numberOfEventsList, p, n) => {
  return numberOfEventsList.reduce((sumOfProbabilities, numberOfEvents) => {
    return sumOfProbabilities = math.add(sumOfProbabilities, countWithBernoulliFormula('single', p, n, numberOfEvents));
  }, 0);
}

const countWithPolynomialFormula = (n, m_list, input_p_list) => {
  const p_list = input_p_list.map(p => math.bignumber(p));

  let n_factorial = math.factorial(n);
  let probabilitiesProduct = p_list.reduce((product, probability, k) => {
    return math.multiply(product, math.pow(math.bignumber(probability), m_list[k]));
  }, math.bignumber(1));

  let numerator = math.multiply(n_factorial, probabilitiesProduct);

  let denominator = m_list.reduce((product, group_count) => {
    return math.multiply(product, math.factorial(group_count));
  }, math.bignumber(1));

  return math.format(math.divide(numerator, denominator), outputFormatSettings);
}

const countWithLocalMoivreLaplasTheorem = (n, m, input_p) => {
  const p = math.bignumber(input_p);
  const q = math.subtract(math.bignumber(1), p);

  let x_numerator, x_denominator;
  x_numerator = math.number(math.subtract(m, math.multiply(p, n)));
  x_denominator = math.sqrt(math.number(math.chain(n).multiply(p).multiply(q).done()));

  const x = math.divide(x_numerator, x_denominator);

  const GaussianDistributionDensityFunction = countGaussianDistributionDensity(x);

  return math.format(math.divide(GaussianDistributionDensityFunction, x_denominator), outputFormatSettings);
}

const countWithBernoulliFormulaAndFormat = (numberOfEventsOption, input_p, n, m) => {
  const probabilityValue = countWithBernoulliFormula(numberOfEventsOption, input_p, n, m);
  return math.format(probabilityValue, outputFormatSettings);
}

// export {countCombinations as combinations};
// export {countGaussianDistributionDensity as GaussianDistributionDensity};
export {countWithBernoulliFormulaAndFormat as Bernoulli};
export {countWithBernoulliFormulaBetweenTwoValues as BernoulliBetween};
export {countWithPolynomialFormula as Polynomial};
export {countWithLocalMoivreLaplasTheorem as MoivreLaplasLocal}
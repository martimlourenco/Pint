import React from 'react';
import { Chart } from 'react-google-charts';

const data = [
  ['Year', 'Sales', 'Expenses'],
  ['2013', 1000, 400],
  ['2014', 1170, 460],
  ['2015', 660, 1120],
  ['2016', 1030, 540],
];

const options = {
  title: 'Company Performance',
  hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
  vAxis: { minValue: 0 },
};

const CompanyPerformanceChart = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Chart
        chartType="AreaChart"
        width="100%"
        height="500px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default CompanyPerformanceChart;

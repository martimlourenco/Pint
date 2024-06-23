import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import "../styles/styles.css";

const Dashboard = () => {
  const [localsData, setLocalsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [startDateData, setStartDateData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalsData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/locais/locals-by-area');
        const formattedData = [
          ['Área', 'Locais'],
          ...response.data.map(item => [item.area_name, parseInt(item.local_count)])
        ];
        setLocalsData(formattedData);
      } catch (error) {
        console.error('Error fetching locals data:', error);
        setError(error.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/users-by-center');
        const formattedData = [
          ['Centro', 'Users'],
          ...response.data.map(item => [item.centro_nome, parseInt(item.user_count)])
        ];
        setUserData(formattedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      }
    };

    const fetchStartDateData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/users-by-start-date');
        const formattedData = [
          ['Data de Início', 'Users'],
          ...response.data.map(item => [item.start_date, parseInt(item.user_count)])
        ];
        setStartDateData(formattedData);
      } catch (error) {
        console.error('Error fetching start date data:', error);
        setError(error.message);
      }
    };

    fetchLocalsData();
    fetchUserData();
    fetchStartDateData();
  }, []);

  const localsOptions = {
    title: 'Quantidade de Locais por Área',
    hAxis: { title: 'Área', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
  };

  const barOptions = {
    title: 'Quantidade de Users por Centro',
    hAxis: { title: 'Centro', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
  };

  const pieOptions = {
    title: 'Distribuição de Users por Centro',
    is3D: true,
  };

  const lineOptions = {
    title: 'Crescimento de Users por Centro ao Longo do Tempo',
    hAxis: { title: 'Tempo' },
    vAxis: { title: 'Users' },
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const columnOptions = {
    title: 'Quantidade de Users por Centro',
    hAxis: { title: 'Centro', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 },
  };

  const areaOptions = {
    title: 'Distribuição de Users por Centro ao Longo do Tempo',
    hAxis: { title: 'Tempo' },
    vAxis: { title: 'Users' },
    isStacked: true,
  };

  const startDateOptions = {
    title: 'Número de Usuários por Data de Início',
    hAxis: { title: 'Data de Início', titleTextStyle: { color: '#333' } },
    vAxis: { title: 'Users' },
    legend: 'none',
    curveType: 'function',
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      {error && <p className="error-message">Error: {error}</p>}
      <div className="chart-container">
        {localsData.length > 1 && (
          <div className="chart-item">
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={localsData}
              options={localsOptions}
            />
          </div>
        )}
        {userData.length > 1 && (
          <>
            <div className="chart-item">
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={userData}
                options={pieOptions}
              />
            </div>
            <div className="chart-item">
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={startDateData}
                options={startDateOptions}
              />
            </div>
            <div className="chart-item">
              <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={userData}
                options={barOptions}
              />
            </div>
            <div className="chart-item">
              <Chart
                chartType="AreaChart"
                width="100%"
                height="400px"
                data={userData}
                options={areaOptions}
              />
            </div>
            <div className="chart-item">
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={userData}
                options={lineOptions}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

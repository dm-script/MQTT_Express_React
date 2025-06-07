import './styleApp.css';
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { useMqtt } from '../mqtt/MqttProvider';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

function MonitorPage() {
  const [time, setTime] = useState(DateTime.now().setZone('Asia/Jakarta'));
  const [key, setKey] = useState('');
  const { connectToBroker, temperature, humidity, isConnected, ps_temperature, ps_humidity, datetimeArray, tempArray, humArray, } = useMqtt();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

  const dataChart = {
    labels: [datetimeArray[0], datetimeArray[1], datetimeArray[2], datetimeArray[3], datetimeArray[4], datetimeArray[5], datetimeArray[6], datetimeArray[7]],
    datasets: [
      {
        label: 'Temperature',
        data: [tempArray[0], tempArray[1], tempArray[2], tempArray[3], tempArray[4], tempArray[5], tempArray[6], tempArray[7]],
        fill: false,
        borderColor: '#5faa46',
        tension: 0.4,
      },
      {
        label: 'Humidity',
        data: [humArray[0], humArray[1], humArray[2], humArray[3], humArray[4], humArray[5], humArray[6], humArray[7]],
        fill: false,
        borderColor: '#6594ff',
        tension: 0.4,
      },
    ],
  };

  // Opsi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    },
    scales: {
      y: {
        ticks: {
          stepSize: 10,       // Set interval setiap 10
          minTicksLimit: 5,   // Maximal hanya 5 ticks yang tampil
          autoSkip: false,     // Menyembunyikan ticks jika terlalu padat
          beginAtZero: true,  // Mulai dari 0
        },
      },
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now().setZone('Asia/Jakarta'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container-phone">
      <div className="topbar d-flex justify-content-center">
        <div className="col-fixed-left d-flex justify-content-center align-items-center">

        </div>

        <div className="col-fixed-center d-flex justify-content-center">
          <div className="d-flex align-items-center py-2">
            <img className="me-2" src="logo192.png" alt="logo" height={45} width={45} />
            <div>
              <p className="fs-4 fw-bolder mb-0 text-center" style={{ lineHeight: 1, fontFamily: "Share Tech" }}>IoT Serve</p>
              <p className="fw-normal text-center mb-0" style={{ fontSize: 13 }}>Build by : DMaulana</p>
            </div>
          </div>
        </div>

        <div className="col-fixed-right d-flex justify-content-center align-items-center">
          <a>
            <i className="bi bi-gear-fill" style={{ fontSize: 20, color: '#585858' }}></i>
          </a>
        </div>

      </div>
      <div className="body-dashboard text-center pt-3 px-3">
        <div className="status-dashboard">
          <img src="/garden_5778758.png" alt="Plant Icon" className="mx-auto mb-2" style={{ height: "110px" }} />
          <h5 className="mb-0 fw-bolder" style={{ fontFamily: "Share Tech" }}>Monitor Garden :</h5>
          {isConnected ? <p className="mb-0 text-success fw-bold">● Online</p> : <p className="mb-0 text-danger fw-bold">● Offline</p>}
          <p style={{ fontSize: 14 }}>{time.toFormat("dd LLL yyyy - HH:mm:ss 'WIB'")}</p>
        </div>

        <div className="card-dashboard">
          <div className="d-flex">

            <input className="form-control ms-2 me-3 mt-1"
              type="text"
              placeholder="Enter Auth Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />

            <button onClick={() => connectToBroker(key)} type="button" className="btn btn-success me-2 mt-1 fw-bold">CONNECT</button>

          </div>
          <p className="card-judul">
            <i className="bi bi-broadcast-pin" style={{ fontSize: 15, color: '#3775ec' }}></i>
            &nbsp; Connection
          </p>
        </div>

        <div className="card-dashboard">
          <div className="row">

            <div className="col">
              <div className="bar-sensor"></div>

              <div className="bar-sensor-move" style={{ backgroundColor: '#5faa46', width: `${ps_temperature}%` }}>
                <i className="bi bi-thermometer-snow icon-left"></i>
              </div>

              <span className="sensor-value">{temperature} °C</span>
            </div>

            <div className="col">
              <div className="bar-sensor"></div>

              <div className="bar-sensor-move" style={{ backgroundColor: '#6594ff', width: `${ps_humidity}%` }}>
                <i className="bi bi-moisture icon-left"></i>
              </div>

              <span className="sensor-value">{humidity} %</span>
            </div>

          </div>
          <p className="card-judul">
            <i className="bi bi-lightning-fill" style={{ fontSize: 15, color: '#3775ec' }}></i>
            &nbsp; Realtime Sensor
          </p>
        </div>

        <div className="card-dashboard">
          <Line data={dataChart} options={options} height={200} />

          <p className="card-judul">
            <i className="bi bi-graph-down" style={{ fontSize: 15, color: '#3775ec' }}></i>
            &nbsp; Log Sensor
          </p>
        </div>
      </div>

      <div className="navbar">
        <div className="col-navbar d-flex justify-content-center">
          <Link to="/" className="text-center">
            <i className="bi bi-speedometer" style={{ fontSize: 20, color: '#3775ec' }}></i>
            <p className="mb-0" style={{ color: '#3775ec' }}>Monitor</p>
          </Link>
        </div>
        <div className="col-navbar d-flex justify-content-center">
          <Link to="/control" className="text-center">
            <i className="bi bi-window-dock" style={{ fontSize: 20, color: '#585858' }}></i>
            <p className="mb-0">Control Panel</p>
          </Link>
        </div>
      </div>
    </div >
  );
}

export default MonitorPage;

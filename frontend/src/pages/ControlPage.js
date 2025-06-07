import './styleApp.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useMqtt } from '../mqtt/MqttProvider';

function ControlPage() {
  const [time, setTime] = useState(DateTime.now().setZone('Asia/Jakarta'));
  const { stTank, stSprinkler, publishControl } = useMqtt();

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
          <a href="/">
            <i className="bi bi-gear-fill" style={{ fontSize: 20, color: '#585858' }}></i>
          </a>
        </div>

      </div>

      <div className="body-dashboard text-center pt-3 px-3">
        <div className="status-dashboard">
          <img src="/garden_5778758.png" alt="Plant Icon" className="mx-auto mb-2" style={{ height: "110px" }} />
          <h5 className="mb-0 fw-bolder" style={{ fontFamily: "Share Tech" }}>Control Garden :</h5>
          <p style={{ fontSize: 14 }}>{time.toFormat("dd LLL yyyy - HH:mm:ss 'WIB'")}</p>
        </div>

        <div className="row">
          <div className="col">
            <div className="card-dashboard">
              <p className="fw-bold">Condition : {stTank ? <span className="text-success">ON</span> : <span className="text-danger">OFF</span>}</p>

              <div className="row">
                <div className="col mb-1">
                  <button onClick={() => publishControl('pumpTank', 1)} type="button" className="btn btn-success btn-sm fw-bold" style={{ width: '120px' }}>ON</button>
                </div> <div className="col">
                  <button onClick={() => publishControl('pumpTank', 0)} type="button" className="btn btn-danger btn-sm fw-bold" style={{ width: '120px' }}>OFF</button>
                </div>
              </div>

              <p className="card-judul mt-2">
                <i className="bi bi-bucket-fill" style={{ fontSize: 15, color: '#3775ec' }}></i>
                &nbsp; Tank Pump
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card-dashboard">
              <p className="fw-bold">Condition : {stSprinkler ? <span className="text-success">ON</span> : <span className="text-danger">OFF</span>}</p>

              <div className="row">
                <div className="col mb-1">
                  <button onClick={() => publishControl('pumpSprinkler', 1)} type="button" className="btn btn-success btn-sm fw-bold" style={{ width: '120px' }}>ON</button>
                </div> <div className="col">
                  <button onClick={() => publishControl('pumpSprinkler', 0)} type="button" className="btn btn-danger btn-sm fw-bold" style={{ width: '120px' }}>OFF</button>
                </div>
              </div>

              <p className="card-judul mt-2">
                <i className="bi bi-tree-fill" style={{ fontSize: 15, color: '#3775ec' }}></i>
                &nbsp; Sprinkler Pump
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar">
        <div className="col-navbar d-flex justify-content-center">
          <Link to="/" className="text-center">
            <i className="bi bi-speedometer" style={{ fontSize: 20, color: '#585858' }}></i>
            <p className="mb-0">Monitor</p>
          </Link>
        </div>
        <div className="col-navbar d-flex justify-content-center">
          <Link to="/control" className="text-center">
            <i className="bi bi-window-dock" style={{ fontSize: 20, color: '#3775ec' }}></i>
            <p className="mb-0" style={{ color: '#3775ec' }}>Control Panel</p>
          </Link>
        </div>
      </div>
    </div >
  );
}

export default ControlPage;

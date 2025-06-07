import React, { createContext, useContext, useState } from 'react';
import mqtt from 'mqtt';

const MqttContext = createContext();

export const useMqtt = () => useContext(MqttContext);

export const MqttProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [tpcCon, setTopicCon] = useState('');

    const [stTank, setStTank] = useState(false);
    const [stSprinkler, setStSprinkler] = useState(false);

    const [temperature, setTemperature] = useState('0');
    const [humidity, setHumidity] = useState('0');
    const [ps_temperature, setPsTemperature] = useState('0');
    const [ps_humidity, setPsHumidity] = useState('0');

    const [datetimeArray, setDatetimeArray] = useState(['', '', '', '', '', '', '', '']);
    const [humArray, setHumArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [tempArray, setTempArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

    const connectToBroker = async (authKey) => {
        const response = await fetch(`${process.env.REACT_APP_API_AUTH}api/authKey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: authKey }),
        });

        if (!response.ok) throw new Error('Authorization failed');

        const { brokerUrl, username, password, topicMonitor, topicControl } = await response.json();

        const mqttClient = mqtt.connect(brokerUrl, {
            username,
            password,
            reconnectPeriod: 1000,
        });

        mqttClient.on('connect', () => {
            setIsConnected(true);
            setTopicCon(topicControl);
            mqttClient.subscribe(topicMonitor);
        });

        mqttClient.on('message', (topic, message) => {
            if (topic === topicMonitor) {
                const { stateTank, stateSprinkler, temp, hum, ps_temp, ps_hum, datetime } = JSON.parse(message.toString());
                setTemperature(temp);
                setHumidity(hum);
                setPsTemperature(ps_temp);
                setPsHumidity(ps_hum);

                if (stateTank === 1) {
                    setStTank(true);
                } else {
                    setStTank(false);
                }

                if (stateSprinkler === 1) {
                    setStSprinkler(true);
                } else {
                    setStSprinkler(false);
                }

                setDatetimeArray(prev => {
                    const newArray = [...prev];
                    newArray[0] = prev[1];
                    newArray[1] = prev[2];
                    newArray[2] = prev[3];
                    newArray[3] = prev[4];
                    newArray[4] = prev[5];
                    newArray[5] = prev[6];
                    newArray[6] = prev[7];
                    newArray[7] = datetime;
                    return newArray;
                });

                setTempArray(prev => {
                    const newArray = [...prev];
                    newArray[0] = prev[1];
                    newArray[1] = prev[2];
                    newArray[2] = prev[3];
                    newArray[3] = prev[4];
                    newArray[4] = prev[5];
                    newArray[5] = prev[6];
                    newArray[6] = prev[7];
                    newArray[7] = temp;
                    return newArray;
                });

                setHumArray(prev => {
                    const newArray = [...prev];
                    newArray[0] = prev[1];
                    newArray[1] = prev[2];
                    newArray[2] = prev[3];
                    newArray[3] = prev[4];
                    newArray[4] = prev[5];
                    newArray[5] = prev[6];
                    newArray[6] = prev[7];
                    newArray[7] = hum;
                    return newArray;
                });
            }
        });

        mqttClient.on('close', () => setIsConnected(false));
        setClient(mqttClient);
    };

    const publishControl = (device, state) => {
        if (client && isConnected) {
            client.publish(tpcCon, JSON.stringify({ [device]: state }));
        }
    };

    return (
        <MqttContext.Provider value={{
            connectToBroker,
            publishControl,
            isConnected,
            temperature,
            humidity,
            ps_humidity,
            ps_temperature,
            datetimeArray,
            tempArray,
            humArray,
            stTank,
            stSprinkler,
        }}>
            {children}
        </MqttContext.Provider>
    );
};
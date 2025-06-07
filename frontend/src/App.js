import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonitorPage from './pages/MonitorPage';
import ControlPage from './pages/ControlPage';
import { MqttProvider } from './mqtt/MqttProvider';

export default function App() {
    return (
        <MqttProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MonitorPage />} />
                    <Route path="/control" element={<ControlPage />} />
                </Routes>
            </Router>
        </MqttProvider>
    );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchStatus();
    fetchData();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/health');
      setStatus(response.data.status);
    } catch (error) {
      setStatus('Error');
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Microservices Platform on EKS</h1>
      <p>Kubernetes cluster with monitoring and CI/CD</p>

      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '20px 0' }}>
        <h2>System Status</h2>
        <p>Backend API: <strong>{status}</strong></p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '20px 0' }}>
        <h2>Architecture</h2>
        <ul>
          <li>AWS EKS Cluster</li>
          <li>Multi-AZ Deployment</li>
          <li>SPOT Instances</li>
          <li>Load Balancer</li>
          <li>Monitoring Stack</li>
        </ul>
      </div>

      {data.length > 0 && (
        <div style={{ border: '1px solid #ddd', padding: '15px', margin: '20px 0' }}>
          <h2>Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

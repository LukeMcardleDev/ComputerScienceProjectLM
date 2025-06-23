import React from 'react';
import '../css/home.css';
import useAppStore from '../stores/useAppStore';

const Home: React.FC = () => {
    
    const setDeviceSearchQuery = useAppStore((state) => state.setDeviceSearchQuery);

    return (
        <div className='home-container'>
            <div className='home-top'>
                <h1>Welcome to Netpedia</h1>
            </div>
            <img className='home-logo' src='./logo512.png' alt='Home' />
            <div className='home-bottom'>
                <h3>Your quick reference for Cisco network devices</h3>
                <div className='search-container'>
                    <input type='text' placeholder='Quick Search Devices' onChange={(e) => setDeviceSearchQuery(e.target.value)} />
                    <button onClick={() => useAppStore.setState({ uiMode: "devices" })}>Go</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
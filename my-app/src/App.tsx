import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Nav from './components/navigation';
import useAppStore from './stores/useAppStore';
import Home from './components/home';
import Devices from './components/devices';
import Fundamentals from './components/fundamentals';
import Test from './components/test';

const ComponentMap: Record<string, React.ComponentType> = {
  default: Home,
  devices: Devices,
  fundamentals: Fundamentals,
  test: Test,
};

function App() {
 const uiMode = useAppStore((state) => state.uiMode);
 const SelectedComponent = ComponentMap[uiMode] || (() => <div>Unknown UI Mode</div>);

  return (
    <div className="App">
      <Header />
      <div className="Main"> 
        <SelectedComponent />
      </div>
      <Nav />
    </div>
  );
}

export default App;
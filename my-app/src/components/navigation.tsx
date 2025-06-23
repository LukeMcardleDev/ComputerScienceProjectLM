import React from 'react';
import useAppStore from '../stores/useAppStore';
import './navigation.css';

const Nav: React.FC = () => {
    const uiMode = useAppStore((state) => state.uiMode);

    const handleClick = (mode: string) => {
        useAppStore.setState({ uiMode: mode as any });
    };

    return (
        <nav className='nav'>
            <div className='nav-links'>
                <div className={`nav-link ${uiMode === 'default' && 'nav-selected'}`} onClick={() => handleClick('default')}>
                    Home
                </div>
                <div className={`nav-link ${uiMode === 'devices' && 'nav-selected'}`} onClick={() => handleClick('devices')}>
                    Devices
                </div>
                <div className={`nav-link ${uiMode === 'fundamentals' && 'nav-selected'}`} onClick={() => handleClick('fundamentals')}>
                    Fundamentals
                </div>
                <div className={`nav-link ${uiMode === 'test' && 'nav-selected'}`} onClick={() => handleClick('test')}>
                    Test
                </div>
            </div>
        </nav>
    );
};

export default Nav;
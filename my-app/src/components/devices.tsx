import React from 'react';
import { Tabs, Collapse, Descriptions } from 'antd';
import type { TabsProps, CollapseProps, DescriptionsProps } from 'antd';
import Routers from '../data/routers.json';
import Switches from '../data/switches.json';
import '../css/devices.css';
import useAppStore from '../stores/useAppStore';

const Devices: React.FC = () => {

    type Router = {
        model: string;
        series: string;
        description: string;
        interfaces: {
            gigabitEthernet: number;
            NIMSlots?: number;
            SMSlots?: number;
        };
        features: string[];
    };

    type Switch = {
        model: string;
        series: string;
        description: string;
        ports: number;
        uplinks: number;
        features: string[];
    };


    const activeTab = useAppStore((state) => state.activeDeviceTab);
    const setActiveTab = useAppStore((state) => state.setActiveDeviceTab);

    const searchQuery = useAppStore((state) => state.deviceSearchQuery);
    const setSearchQuery = useAppStore((state) => state.setDeviceSearchQuery);

    // Filter based on tab
    const data: (Router | Switch)[] = activeTab === 'routers' ? Routers : Switches;

    const filteredData = data.filter((item) =>
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const items: CollapseProps['items'] = filteredData.map((device, index) => {
        const description: DescriptionsProps['items'] = [
            {
                key: '1',
                label: 'Model',
                children: device.model,
            },
            {
                key: '2',
                label: 'Series',
                children: device.series,
            },
            {
                key: '3',
                label: 'Description',
                children: device.description,
            },
        ];

        if ('interfaces' in device) {
            // Router-specific
            description.push({
                key: '4',
                label: 'Interfaces',
                children: (
                    <>
                        Gigabit Ethernet: {device.interfaces.gigabitEthernet}
                        <br />
                        NIM Slots: {device.interfaces.NIMSlots ?? 'N/A'}
                        <br />
                        SM Slots: {device.interfaces.SMSlots ?? 'N/A'}
                    </>
                ),
            });
        }

        if ('ports' in device) {
            // Switch-specific
            description.push({
                key: '4',
                label: 'Ports',
                children: (
                    <>
                        Ports: {device.ports}
                        <br />
                        Uplinks: {device.uplinks}
                    </>
                ),
            });
        }

        if (device.features?.length) {
            description.push({
                key: '5',
                label: 'Features',
                children: (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {device.features.map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                        ))}
                    </ul>
                ),
            });
        }

        return {
            key: index + 1,
            label: device.model,
            children: <Descriptions title={device.model} items={description} />,
        };
    });

    const tabItems: TabsProps['items'] = [
        {
            key: 'routers',
            label: 'Routers',
        },
        {
            key: 'switches',
            label: 'Switches',
        },
        // 🚀 To add more, just push more items here!
    ];

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    style={{ gridColumn: '1 / span 5', marginTop: '1rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Tabs
                className='tab-container'
                defaultActiveKey="routers"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
            />

            <Collapse
                accordion
                expandIconPosition="end"
                items={items}
            />
        </div>
    );
};

export default Devices;

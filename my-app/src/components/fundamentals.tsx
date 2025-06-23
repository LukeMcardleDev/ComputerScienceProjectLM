import React from 'react';
import { useEffect } from 'react';
import type { CollapseProps, DescriptionsProps } from 'antd';
import { Collapse, Descriptions } from 'antd';
import FundData from '../data/fundamentals.json';
import '../css/fundamentals.css';
import useAppStore from '../stores/useAppStore';

const Fundamentals: React.FC = () => {

    const fundSearchQuery = useAppStore((state) => state.fundSearchQuery);
    const setFundSearchQuery = useAppStore((state) => state.setFundSearchQuery);

    const filteredFundamentals = FundData.filter((router) =>
        router.topic.toLowerCase().includes(fundSearchQuery.toLowerCase()) ||
        router.description.toLowerCase().includes(fundSearchQuery.toLowerCase())
    );

    const items = filteredFundamentals.map((router, index) => {

        const description: DescriptionsProps['items'] = [
            {
                key: '1',
                label: 'Model',
                children: router.topic,
            },
            {
                key: '2',
                label: 'Series',
                children: router.description,
            },
            {
                key: '3',
                label: 'Layers',
                children: router.layers?.join(', ') || 'N/A',
            },
            {
                key: '3',
                label: 'Key Points',
                children: router.keyPoints?.join(', ') || 'N/A',
            },
        ];

        return {
            key: index + 1,
            label: router.topic,
            children: <Descriptions title={router.topic} items={description} />,
        };
    });

    return (
        <div>
            <div className='search-container'>
                <input type='text' placeholder='Search...' style={{ gridColumn: '1 / span 5', marginTop: '1rem' }} value={fundSearchQuery} onChange={(e) => setFundSearchQuery(e.target.value)} />
            </div>
            <Collapse
                accordion
                expandIconPosition='end'
                items={items}
            />
        </div>
    );
};

export default Fundamentals;
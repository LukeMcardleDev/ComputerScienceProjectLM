import React, { useEffect, useRef } from 'react';
import useAppStore from '../stores/useAppStore';
import Routers from '../data/routers.json';
import Switches from '../data/switches.json';

// PatternFly Topology imports
import {
    Visualization,
    VisualizationProvider,
    VisualizationSurface,
    GraphComponent,
    DefaultNode,
    DefaultEdge,
    ColaLayout,
    ModelKind,
    NodeModel,
    EdgeModel,
    GraphModel,
    NodeShape,
    withPanZoom,
    withDragNode,
    withSelection
} from '@patternfly/react-topology';

import '@patternfly/react-core/dist/styles/base.css';

const Test: React.FC = () => {
    const testNetwork = useAppStore((s) => s.testNetwork);
    const setName = useAppStore((s) => s.setTestNetworkName);
    const setRouter = useAppStore((s) => s.setTestNetworkRouter);
    const setSwitches = useAppStore((s) => s.setTestNetworkSwitches);
    const clear = useAppStore((s) => s.clearTestNetwork);

    const visualizationRef = useRef<Visualization | null>(null);

    const router = Routers.find((r) => r.model === testNetwork.router);
    const selectedSwitches = Switches.filter((s) =>
        testNetwork.switches.includes(s.model)
    );

    // ✅ Build the dynamic topology model
    const createTopologyModel = (): {
        graph: GraphModel;
        nodes: NodeModel[];
        edges: EdgeModel[];
        kind: ModelKind;
    } => {
        const nodes: NodeModel[] = [];
        const edges: EdgeModel[] = [];

        if (router) {
            nodes.push({
                id: router.model,
                label: router.model,
                type: 'node',
                shape: NodeShape.ellipse,
                width: 80,
                height: 80,
                style: { fill: '#0066CC', stroke: '#004080' },
            });
        }

        selectedSwitches.forEach((sw) => {
            nodes.push({
                id: sw.model,
                label: sw.model,
                type: 'node',
                shape: NodeShape.rect,
                width: 100,
                height: 50,
                style: { fill: '#8BC34A', stroke: '#558B2F' },
            });

            if (router) {
                edges.push({
                    id: `${router.model}-${sw.model}`,
                    source: router.model,
                    target: sw.model,
                    type: 'edge',
                });
            }
        });

        return {
            kind: ModelKind.graph,
            graph: {
                id: 'graph',
                type: 'graph',
                layout: 'Cola',
            },
            nodes,
            edges,
        };
    };

    // ✅ Initialize the Visualization controller only once
    if (!visualizationRef.current) {
        const viz = new Visualization();
        visualizationRef.current = viz;

        // Layout factory
        viz.registerLayoutFactory((type, graph) => new ColaLayout(graph));

        // Component factory — wrap node & graph properly!
        viz.registerComponentFactory((kind, type) => {
            switch (kind) {
                case ModelKind.graph:
                    return withPanZoom()(GraphComponent); // ✅ panning & zooming
                case ModelKind.node:
                    return withDragNode()(withSelection()(DefaultNode)); // ✅ drag + select
                case ModelKind.edge:
                    return DefaultEdge; // basic edge is fine
                default:
                    return undefined;
            }
        });

        // Load initial model
        viz.fromModel(createTopologyModel(), false);
    }

    // ✅ Update the model when router or switches change
    useEffect(() => {
        const viz = visualizationRef.current;
        if (viz) {
            viz.fromModel(createTopologyModel(), true);
        }
    }, [testNetwork.router, testNetwork.switches]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Create Test Network</h2>

            <div>
                <label>Network Name:</label>
                <input
                    value={testNetwork.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Test Network"
                />
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Router:</label>
                <select
                    value={testNetwork.router}
                    onChange={(e) => setRouter(e.target.value)}
                >
                    <option value="">Select a router</option>
                    {Routers.map((r) => (
                        <option key={r.model} value={r.model}>
                            {r.model}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Switches:</label>
                <div
                    style={{
                        marginTop: '0.5rem',
                        maxHeight: '100px', // adjust to taste
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '0.5rem',
                        background: '#f9f9f9',
                    }}
                >
                    {Switches.map((s) => (
                        <label
                            key={s.model}
                            style={{ display: 'block', marginBottom: '0.25rem' }}
                        >
                            <input
                                type="checkbox"
                                value={s.model}
                                checked={testNetwork.switches.includes(s.model)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSwitches([...testNetwork.switches, s.model]);
                                    } else {
                                        setSwitches(
                                            testNetwork.switches.filter((sw) => sw !== s.model)
                                        );
                                    }
                                }}
                            />
                            {s.model}
                        </label>
                    ))}
                </div>
            </div>

            <button style={{ marginTop: '1rem' }} onClick={clear}>
                Clear
            </button>

            <h3 style={{ marginTop: '2rem' }}>Mock Topology</h3>

            <div
                style={{
                    height: '350px',
                    border: '1px solid #ddd',
                    marginTop: '1rem',
                }}
            >
                <VisualizationProvider controller={visualizationRef.current}>
                    <VisualizationSurface />
                </VisualizationProvider>
            </div>
        </div>
    );
};

export default Test;

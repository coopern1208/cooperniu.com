// Graph Configuration
const GRAPH_CONFIG = {
    nodeRadius: 10,
    fontSize: 12,
    strokeWidth: 2,
    linkWidth: 3,
    highlightWidth: 5,
    zoom: 1,
    minZoom: 0.8,
    maxZoom: 1.2,
    stabilizationDelay: 1000
};

// CSS Color mapping
const GROUP_COLORS = {
    'gauge': 'var(--color-gauge)',
    'covariant': 'var(--color-covariant)',
    'scalar interaction': 'var(--color-scalar-interaction)',
    'gauge interaction': 'var(--color-gauge-interaction)',
    'fermion': 'var(--color-fermion)',
    'yukawa': 'var(--color-yukawa)'
};

// Global variables
let graphData = null;
let Graph = null;
let highlightNode = null;
let highlightLink = null;
let neighborNodes = new Set();

// Utility Functions
const getCSSColor = (group) => {
    const colorVar = GROUP_COLORS[group];
    if (!colorVar) return null;
    
    const tempElement = document.createElement('div');
    tempElement.style.color = colorVar;
    document.body.appendChild(tempElement);
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    return computedColor;
};

const captureNodePositions = () => {
    if (!Graph) return {};
    
    const positions = {};
    Graph.graphData().nodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
            positions[node.id] = { x: node.x, y: node.y };
        }
    });
    return positions;
};

const savePositions = () => {
    const positions = captureNodePositions();
    localStorage.setItem('graphNodePositions', JSON.stringify(positions));
    console.log('Positions saved:', positions);
};

const loadPositions = () => {
    const saved = localStorage.getItem('graphNodePositions');
    return saved ? JSON.parse(saved) : null;
};

// Graph Functions
const getNeighborNodes = (node) => {
    if (!node || !graphData) return new Set();
    
    const neighbors = new Set();
    graphData.links.forEach(link => {
        if (link.source === node) {
            neighbors.add(link.target);
        } else if (link.target === node) {
            neighbors.add(link.source);
        }
    });
    return neighbors;
};

const updateHighlight = () => {
    if (!Graph) return;
    
    // Update neighbor nodes set
    neighborNodes = highlightNode ? getNeighborNodes(highlightNode) : new Set();
    
    Graph
        .linkWidth(link => 
            highlightNode && (link.source === highlightNode || link.target === highlightNode) 
            ? GRAPH_CONFIG.highlightWidth
            : GRAPH_CONFIG.linkWidth
        )
        .linkColor(link => 
            highlightNode && (link.source === highlightNode || link.target === highlightNode) 
            ? 'black' 
            : 'black'
        );
};

const renderNode = (node, ctx, globalScale) => {
    const fontSize = GRAPH_CONFIG.fontSize / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Determine if this node should be highlighted
    const isHighlighted = highlightNode && node === highlightNode;
    const isNeighbor = highlightNode && neighborNodes.has(node);
    
    // Get color from CSS or fallback to node color
    const nodeColor = getCSSColor(node.group) || node.color;
    ctx.fillStyle = nodeColor;
    
    // No opacity changes - keep full opacity for all nodes
    ctx.globalAlpha = 1.0;
    
    // Draw node - triangles for Yukawa nodes, squares for covariant nodes, circles for others
    ctx.beginPath();
    if (node.group === 'yukawa') {
        // Draw triangle for Yukawa nodes
        const radius = GRAPH_CONFIG.nodeRadius;
        const x = node.x;
        const y = node.y;
        
        // Calculate triangle vertices (pointing up)
        const topX = x;
        const topY = y - radius;
        const leftX = x - radius * Math.cos(Math.PI / 6);
        const leftY = y + radius * Math.sin(Math.PI / 6);
        const rightX = x + radius * Math.cos(Math.PI / 6);
        const rightY = y + radius * Math.sin(Math.PI / 6);
        
        ctx.moveTo(topX, topY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
    } else if (node.group === 'covariant') {
        // Draw square for covariant nodes
        const size = GRAPH_CONFIG.nodeRadius * 2;
        const x = node.x - GRAPH_CONFIG.nodeRadius;
        const y = node.y - GRAPH_CONFIG.nodeRadius;
        
        ctx.rect(x, y, size, size);
    } else {
        // Draw circle for all other nodes
        ctx.arc(node.x, node.y, GRAPH_CONFIG.nodeRadius, 0, 2 * Math.PI, false);
    }
    ctx.fill();
    
    // Add border with enhanced styling for highlighted nodes
    if (isHighlighted) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = GRAPH_CONFIG.strokeWidth + 2;
    } else if (isNeighbor) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = GRAPH_CONFIG.strokeWidth + 2;
    } else {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = GRAPH_CONFIG.strokeWidth;
    }
    ctx.stroke();
};

// Data Loading
const loadGraphData = async () => {
    try {
        const response = await fetch('d3.js/graphData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading graph data:', error);
        return null;
    }
};

// Graph Initialization
const initializeGraph = async () => {
    // Load data
    graphData = await loadGraphData();
    if (!graphData) {
        console.error('Failed to load graph data');
        return;
    }

    // Apply initial positions
    if (graphData.initialPositions) {
        graphData.nodes.forEach(node => {
            const position = graphData.initialPositions[node.id];
            if (position) {
                node.x = position.x;
                node.y = position.y;
            }
        });
    }

    // Create graph
    const graphElement = document.getElementById('graph');
    Graph = ForceGraph()
        (graphElement)
        .graphData(graphData)

        .width(graphElement.offsetWidth)
        .height(graphElement.offsetHeight)
        .nodeAutoColorBy('group')
        .nodeCanvasObject(renderNode)
        .linkDirectionalArrowLength(5)
        .nodeLabel(node => node.id)
        .linkCurvature('curvature')
        .nodeRelSize(GRAPH_CONFIG.nodeRadius)
        .linkWidth(GRAPH_CONFIG.linkWidth)
        .linkDirectionalArrowLength(0)
        .zoom(GRAPH_CONFIG.zoom)
        .minZoom(GRAPH_CONFIG.minZoom)
        .maxZoom(GRAPH_CONFIG.maxZoom)
        .onNodeHover(node => {
            if (node) {
                highlightNode = node;
            } else {
                highlightNode = null;
                neighborNodes = new Set();
            }
            updateHighlight();
        })
        .onLinkHover(link => {
            highlightLink = link;
            updateHighlight();
        })
        .onBackgroundClick(() => {
            highlightNode = null;
            highlightLink = null;
            neighborNodes = new Set();
            updateHighlight();
        })
        .onEngineStop(() => {
            setTimeout(savePositions, GRAPH_CONFIG.stabilizationDelay);
        });
};

// Initialize on load
initializeGraph();
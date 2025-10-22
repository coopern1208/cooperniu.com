const graphData = {
    nodes: [
        { id: "Gauge Sector", group: "particle"},
        { id: "B boson", group: "gauge" },
        { id: "W boson", group: "gauge" },
        { id: "G boson", group: "gauge" },
        { id: "Higgs", group: "gauge"},

        { id: "Dµ0", group: "covariant" },
        { id: "Dµ1", group: "covariant" },
        { id: "Dµ2", group: "covariant" },
        { id: "Dµ3", group: "covariant" },
        { id: "Dµ4", group: "covariant" },
        { id: "Dµ5", group: "covariant" },

        { id: "H2", group: "scalar interaction" },
        { id: "H4", group: "scalar interaction" },

        { id: "BB", group: "gauge interaction" },
        { id: "WW", group: "gauge interaction" },
        { id: "GG", group: "gauge interaction" },
        { id: "BB-dual", group: "gauge interaction" },
        { id: "WW-dual", group: "gauge interaction" },
        { id: "GG-dual", group: "gauge interaction" },

        { id: "QL", group: "fermion" },
        { id: "LL", group: "fermion" },
        { id: "uR", group: "fermion" },
        { id: "dR", group: "fermion" },
        { id: "eR", group: "fermion" },

        { id: "Yu", group: "yukawa" },
        { id: "Yd", group: "yukawa" },
        { id: "Ye", group: "yukawa" },

    ],
    links: [
        { source: "Gauge Sector", target: "B boson" },
        { source: "Gauge Sector", target: "W boson" },
        { source: "Gauge Sector", target: "G boson" },

        { source: "B boson", target: "BB" , curvature: 0.5},
        { source: "BB", target: "B boson" , curvature: 0.5},
        { source: "W boson", target: "WW" , curvature: 0.5},
        { source: "WW", target: "W boson" , curvature: 0.5},
        { source: "G boson", target: "GG" , curvature: 0.5},
        { source: "GG", target: "G boson" , curvature: 0.5},

        { source: "B boson", target: "BB-dual" , curvature: 0.5},
        { source: "BB-dual", target: "B boson" , curvature: 0.5},
        { source: "W boson", target: "WW-dual" , curvature: 0.5},
        { source: "WW-dual", target: "W boson" , curvature: 0.5},
        { source: "G boson", target: "GG-dual" , curvature: 0.5},
        { source: "GG-dual", target: "G boson" , curvature: 0.5},

        { source: "Higgs", target: "Dµ0" },
        { source: "Dµ0", target: "Gauge Sector" },

        { source: "Higgs", target: "H2" , curvature: 0.5},
        { source: "H2", target: "Higgs" , curvature: 0.5},
        { source: "Higgs", target: "H4" , curvature: 0.5},
        { source: "H4", target: "Higgs" , curvature: 0.5},

        { source: "Gauge Sector", target: "Dµ1" },
        { source: "Dµ1", target: "QL" },
        { source: "Gauge Sector", target: "Dµ2" },
        { source: "Dµ2", target: "LL" },
        { source: "Gauge Sector", target: "Dµ3" },
        { source: "Dµ3", target: "uR" },
        { source: "Gauge Sector", target: "Dµ4" },
        { source: "Dµ4", target: "dR" },
        { source: "Gauge Sector", target: "Dµ5" },
        { source: "Dµ5", target: "eR" },

        { source: "Higgs", target: "Yu" },
        { source: "QL", target: "Yu" },
        { source: "uR", target: "Yu" },

        { source: "Higgs", target: "Yd" },
        { source: "QL", target: "Yd" },
        { source: "dR", target: "Yd" },

        { source: "Higgs", target: "Ye" },
        { source: "LL", target: "Ye" },
        { source: "eR", target: "Ye" },
    ]
};

// Function to capture current node positions
function captureNodePositions() {
    const positions = {};
    Graph.graphData().nodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
            positions[node.id] = { x: node.x, y: node.y };
        }
    });
    return positions;
}

// Function to save positions to localStorage
function savePositions() {
    const positions = captureNodePositions();
    localStorage.setItem('graphNodePositions', JSON.stringify(positions));
    console.log('Positions saved:', positions);
}

// Function to load positions from localStorage
function loadPositions() {
    const saved = localStorage.getItem('graphNodePositions');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Define the captured positions as initial positions
const initialPositions = {
    "B boson": { x: 93.34935446201567, y: 41.93388477838501 },
    "BB": { x: 127.66061453585198, y: 54.840455489958536 },
    "BB-dual": { x: 111.17343127944507, y: 74.14902944655347 },
    "Dµ0": { x: -40.75984312542076, y: 2.708948927800592 },
    "Dµ1": { x: -2.650002608983624, y: 33.02982040915768 },
    "Dµ2": { x: -1.7076462883044259, y: -46.10319398914808 },
    "Dµ3": { x: 15.595657451505835, y: 40.3710662959988 },
    "Dµ4": { x: -4.454461067095525, y: 10.416432900976538 },
    "Dµ5": { x: -6.730181191120422, y: -28.877885735058626 },
    "G boson": { x: 108.36686082224844, y: -23.865211222755494 },
    "GG": { x: 139.33508905530527, y: -43.51269849072844 },
    "GG-dual": { x: 144.84573651664118, y: -19.697985449573782 },
    "Gauge Sector": { x: 34.10615231925838, y: -8.19749732389709 },
    "H2": { x: -148.53270189002922, y: 7.992954269974858 },
    "H4": { x: -147.16580223016862, y: 31.404976011792673 },
    "Higgs": { x: -112.78821595949536, y: 17.364959557070357 },
    "LL": { x: -58.912835353064594, y: -61.84885051680916 },
    "QL": { x: -51.67278126756692, y: 64.931956902653 },
    "W boson": { x: 67.1761436205922, y: -78.15659053690648 },
    "WW": { x: 69.2119538636792, y: -114.78262472012261 },
    "WW-dual": { x: 92.20228255147221, y: -105.14262136028066 },
    "Yd": { x: -93.14685944307197, y: 49.380667582903065 },
    "Ye": { x: -99.76029569173373, y: -33.58514863365333 },
    "Yu": { x: -88.02651080806243, y: 68.07314679468527 },
    "dR": { x: -53.16452578205826, y: 33.76626053077855 },
    "eR": { x: -59.116376036844464, y: -41.798408444272674 },
    "uR": { x: -34.4342377349951, y: 75.20415652451801 }
};

// Apply initial positions to graphData (as starting positions, not fixed)
graphData.nodes.forEach(node => {
    if (initialPositions[node.id]) {
        node.x = initialPositions[node.id].x;
        node.y = initialPositions[node.id].y;
    }
});

const Graph = ForceGraph()
    (document.getElementById('graph'))
    .graphData(graphData)
    .width(document.getElementById('graph').offsetWidth)
    .height(document.getElementById('graph').offsetHeight)
    .nodeAutoColorBy('group')
    .linkDirectionalArrowLength(5)
    .nodeLabel(node => node.id)
    .linkCurvature('curvature')
    .nodeRelSize(10)
    .linkWidth(4)
    .linkDirectionalArrowLength(0)
    .zoom(1)
    .minZoom(0.8)
    .maxZoom(1.2)
    //.enablePanInteraction(false)
    .onNodeHover(node => {
        highlightNode = node;
        updateHighlight();
    })
    .onLinkHover(link => {
        highlightLink = link;
        updateHighlight();
    });

// Add event listener to save positions when graph stabilizes
Graph.onEngineStop(() => {
    setTimeout(() => {
        savePositions();
    }, 1000); // Wait 1 second after stabilization
});

let highlightNode = null;  // Store hovered node
let highlightLink = null;  // Store hovered link

function updateHighlight() {
    Graph
        .linkWidth(link => 
            highlightNode && (link.source === highlightNode || link.target === highlightNode) 
            ? 6 // Thicker highlight
            : 4
        )
        .linkColor(link => 
            highlightNode && (link.source === highlightNode || link.target === highlightNode) 
            ? 'black' 
            : 'gray'
        );
}
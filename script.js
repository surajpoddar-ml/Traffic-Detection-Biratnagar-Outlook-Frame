// Initialize map (default view)
const map = L.map('map').setView([26.4545, 87.2718], 13);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Layers
let trafficLayer = L.layerGroup().addTo(map);
let accidentLayer = L.layerGroup().addTo(map);
let constructionLayer = L.layerGroup().addTo(map);
let waterLayer = L.layerGroup().addTo(map);

//Info panel
const updatesList = document.getElementById('updates-list');

// Mode buttons
document.getElementById('mode-local').addEventListener('click', () => setMode('Local People'));
document.getElementById('mode-rider').addEventListener('click', () => setMode('Riders'));
document.getElementById('mode-tourist').addEventListener('click', () => setMode('Tourists'));
document.getElementById('reset-map').addEventListener('click', resetMap);

function setMode(mode) {
    updatesList.innerHTML = `<li>Mode switched to <b>${mode}</b></li>`;
}

function resetMap() {
    map.setView([26.4545, 87.2718], 13);
    trafficLayer.clearLayers();
    accidentLayer.clearLayers();
    constructionLayer.clearLayers();
    waterLayer.clearLayers();
    updatesList.innerHTML = `<li>Map reset! Search a route to see live updates.</li>`;
}

// Areas for construction
const constructionAreas = [
    "Naya Bazar", "Haraincha Chowk", "Bada Bazar Road", "Laxmi Chowk", "Ward 12 Road"
];

// Random coordinates generator
function generateRandomLatLng() {
    const lat = 26.45 + Math.random() * 0.01;
    const lng = 87.27 + Math.random() * 0.01;
    return [lat, lng];
}

// Live updates functions
function addTrafficUpdate() {
    const latlng = generateRandomLatLng();
    L.circle(latlng, { radius: 50, color: 'green', fillOpacity: 0.5 }).addTo(trafficLayer);
    const li = document.createElement('li');
    li.textContent = `🚦 Traffic congestion at (${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)})`;
    updatesList.prepend(li);
}

function addAccidentUpdate() {
    const latlng = generateRandomLatLng();
    L.marker(latlng, { icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [25,25] }) }).addTo(accidentLayer);
    const li = document.createElement('li');
    li.textContent = `⚠️ Accident at (${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)})`;
    updatesList.prepend(li);
}

function addConstructionUpdate() {
    const latlng = generateRandomLatLng();
    const area = constructionAreas[Math.floor(Math.random() * constructionAreas.length)];
    L.rectangle([ [latlng[0]-0.001, latlng[1]-0.001], [latlng[0]+0.001, latlng[1]+0.001] ], { color: 'orange', fillOpacity: 0.3 }).addTo(constructionLayer);
    const li = document.createElement('li');
    li.textContent = `🚧 Construction ongoing at ${area}`;
    updatesList.prepend(li);
}

function addWaterlogUpdate() {
    const latlng = generateRandomLatLng();
    L.circle(latlng, { radius: 40, color: 'blue', fillOpacity: 0.3 }).addTo(waterLayer);
    const li = document.createElement('li');
    li.textContent = `💧 Waterlogging at (${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)})`;
    updatesList.prepend(li);
}

// Interval holder
let liveUpdateInterval = null;

// Search route button
document.getElementById('search-route').addEventListener('click', () => {
    const from = document.getElementById('from-location').value || "Current Location";
    const to = document.getElementById('to-location').value || "Destination";

    alert(`Routing from "${from}" to "${to}" (Demo mode)`);

    // Clear previous layers
    trafficLayer.clearLayers();
    accidentLayer.clearLayers();
    constructionLayer.clearLayers();
    waterLayer.clearLayers();
    updatesList.innerHTML = `<li>Route found! Live updates will appear below:</li>`;

    // Start live updates after search
    if(liveUpdateInterval) clearInterval(liveUpdateInterval);
    liveUpdateInterval = setInterval(() => {
        addTrafficUpdate();
        addAccidentUpdate();
        addConstructionUpdate();
        addWaterlogUpdate();
    }, 5000);
});


/* eslint-disable no-undef */
/**
 * multiple tile layers
 */

// magnification with which the map will start
const zoom = 12;
// co-ordinates
const lat = 54.3520;
const lng = 18.6463;

const osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
const cartoDB = '<a href="http://cartodb.com/attributions">CartoDB</a>';

const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = `&copy; ${osmLink} Contributors`;
const landUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png";
const cartoAttrib = `&copy; ${osmLink} Contributors & ${cartoDB}`;

const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
const landMap = L.tileLayer(landUrl, { attribution: cartoAttrib });

var  WAQI_URL  =  "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=_TOKEN_ID_";
var  WAQI_ATTR  =  'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';
var  waqiLayer  =  L.tileLayer(WAQI_URL,  {  attribution:  WAQI_ATTR  });

// config map
let config = {
    layers: [osmMap],
    minZoom: 7,
    maxZoom: 18,
};

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

var baseLayers = {
    "Map": osmMap
};

var overlayLayers = {
    "Air Pollution": waqiLayer
}

L.control.layers(baseLayers, overlayLayers).addTo(map);

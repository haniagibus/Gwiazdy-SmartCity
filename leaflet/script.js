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

const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = `&copy; ${osmLink} Contributors`;
const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });

var  WAQI_URL  =  "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=_TOKEN_ID_";
var  WAQI_ATTR  =  'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';
var  waqiLayer  =  L.tileLayer(WAQI_URL,  {  attribution:  WAQI_ATTR  });

// config map
let config = {
    layers: [osmMap],
    minZoom: 8,
    maxZoom: 18,
};

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);
L.Control.geocoder().addTo(map);

var baseLayers = {
    "Map": osmMap
};

var overlayLayers = {
    "Air Pollution": waqiLayer,
};

var layerControl=L.control.layers(baseLayers, overlayLayers).addTo(map);

fetch("/geojson-data/noise-pollution.geojson")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var noisePollution = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.stroke,
                    weight: feature.properties['stroke-width'],
                    opacity: feature.properties['stroke-opacity'],
                    fillColor: feature.properties.fill,
                    fillOpacity: feature.properties['fill-opacity']
                };
            }
        });
        layerControl.addOverlay(noisePollution, "Noise level");
        noisePollution.addTo(map);
    });


fetch("/geojson-data/green-terrains.geojson")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var parkLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.stroke,
                    weight: feature.properties['stroke-width'],
                    opacity: feature.properties['stroke-opacity'],
                    fillColor: feature.properties.fill,
                    fillOpacity: feature.properties['fill-opacity']
                };
            }
        })
            .bindPopup(function(layer){
                if (layer.feature.properties.name != null) {
                    var media = layer.feature.properties.media
                    image = "<img src='" + media + "' style=\"width:130px;height:70px;\">"
                        + "<a target='_blank' href='" + media + "'></a>"

                    return layer.feature.properties.name + '</br>' + image;
                }
            });

        layerControl.addOverlay(parkLayer, "Parks");
        parkLayer.addTo(map);

    });

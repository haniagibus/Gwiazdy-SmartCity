let allMarkers = {};

function createMap() {
    // magnification with which the map will start
    const zoom = 12;
    // co-ordinates
    const lat = 54.3520;
    const lng = 18.6463;

    const osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const osmAttr = `&copy; ${osmLink} Contributors`;
    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttr });



    // config map
    let config = {
        layers: [osmMap],
        minZoom: 11,
        maxZoom: 18,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    };

    // calling map
    const map = L.map(document.getElementById("leaflet-map"), config).setView([lat, lng], zoom);

    var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 11,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png',
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    });

    var baseLayers = {
        "Light mode": osmMap,
        "Dark mode": Stadia_AlidadeSmoothDark
    };

    new L.basemapsSwitcher([
        {
            layer: osmMap.addTo(map), //DEFAULT MAP
            icon: './static/features/switch-basemap/assets/light_mode.png',
            name: 'Light Mode'
        },
        {
            layer: Stadia_AlidadeSmoothDark,
            icon: './static/features/switch-basemap/assets/dark_mode.png',
            name: 'Dark Mode'
        }
    ], { position: 'bottomleft' }).addTo(map);

    var airPollutionMarkers = L.layerGroup();

    L.Control.geocoder().addTo(map);
    var layerControl=L.control.layers().addTo(map);

    setTimeout(function () {
        map.on("moveend", () => {
            let bounds = map.getBounds();
            bounds =
                bounds.getNorth() +
                "," +
                bounds.getWest() +
                "," +
                bounds.getSouth() +
                "," +
                bounds.getEast();

            populateMarkers(map, layerControl, airPollutionMarkers, bounds, true);
        });
    }, 1000);

    layerControl.addOverlay(airPollutionMarkers, "Air Pollution");

    fetch("../static/geojson-data/green-terrains.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var greenTerrains = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: feature.properties.stroke,
                        weight: feature.properties['stroke-width'],
                        opacity: feature.properties['stroke-opacity'],
                        fillColor: feature.properties.fill,
                        fillOpacity: feature.properties['fill-opacity']
                    };
                }
            }).bindPopup(function(layer){
                if (layer.feature.properties.name != null) {
                    var media = layer.feature.properties.media
                    image = "<img src='" + media + "' style=\"width:130px;height:70px;\">"
                        + "<a target='_blank' href='" + media + "'></a>"

                    return layer.feature.properties.name + '</br>' + image;
                }
            });

        layerControl.addOverlay(greenTerrains, "Green Terrains");
    });


    fetch("../static/geojson-data/noise-pollution.geojson")
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

            layerControl.addOverlay(noisePollution, "Noise Pollution");
        });

    fetch("../static/geojson-data/critical-points.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var criticalPoints = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: feature.properties['marker-color']
                    };
                }
            }).bindPopup(function(layer) {
                return layer.feature.properties.name;
            });

            layerControl.addOverlay(criticalPoints, "Critical Points");
        });

    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <svg width="160" height="180" xmlns="http://www.w3.org/2000/svg">
             <rect width="130" height="150" x="10" y="10" rx="20" ry="20" fill="white" opacity="0.83" />
                <text x="20" y="40" font-size="14" font-family="Arial" fill="black">Noise Levels</text>
                
                <rect x="20" y="60" width="12" height="12" fill="#640d5f" />
                <text x="40" y="70" font-size="12" font-family="Arial" fill="black">75,0-79,9 dB</text>
    
                <rect x="20" y="90" width="12" height="12" fill="#da1629" />
                <text x="40" y="100" font-size="12" font-family="Arial" fill="black">65,0-74,9 dB</text>
    
                <rect x="20" y="120" width="12" height="12" fill="#eb5b00" />
                <text x="40" y="130" font-size="12" font-family="Arial" fill="black">55,0-64,9 dB</text> 
              </svg>
        `;
        return div;
    };

    map.on('overlayadd', function (eventLayer) {
        if (eventLayer.name === "Noise Pollution") {
            legend.addTo(map);
        }
    });

    map.on('overlayremove', function (eventLayer) {
        if (eventLayer.name === "Noise Pollution") {
            map.removeControl(legend);
        }
    });

    return map;
}

function populateMarkers(map, layerControl, markers, bounds, isRefresh) {
    return fetch(
        "https://api.waqi.info/v2/map/bounds/?latlng=" +
        bounds +
        "&token=45063d60883e4e40b7767cfde837e5af75139432"
    )
        .then((x) => x.json())
        .then((stations) => {
            if (stations.status != "ok") throw stations.data;

            stations.data.forEach((station) => {
                if (allMarkers[station.uid])
                    map.removeLayer(allMarkers[station.uid]);

                let iw = 83,
                    ih = 107;
                let icon = L.icon({
                    iconUrl:
                        "https://waqi.info/mapicon/" + station.aqi + ".30.png",
                    iconSize: [iw / 2, ih / 2],
                    iconAnchor: [iw / 4, ih / 2 - 5],
                });

                let marker = L.marker([station.lat, station.lon], {
                    zIndexOffset: station.aqi,
                    title: station.station.name,
                    icon: icon,
                }).addTo(markers);

                marker.on("click", () => {
                    let popup = L.popup()
                        .setLatLng([station.lat, station.lon])
                        .setContent(station.station.name)
                        .openOn(map);

                    getMarkerPopup(station.uid).then((info) => {
                        popup.setContent(info);
                    });
                });

                allMarkers[station.uid] = marker;
            });
        })
}

function getMarkerPopup(markerUID) {
    return getMarkerAQI(markerUID).then((marker) => {
        let info =
            marker.city.name +
            ": AQI " +
            marker.aqi +
            " updated on " +
            new Date(marker.time.v * 1000).toLocaleTimeString() +
            "<br>";

        if (marker.city.location) {
            info += "<b>Location</b>: ";
            info += "<small>" + marker.city.location + "</small><br>";
        }

        let pollutants = ["pm25", "pm10", "o3", "no2", "so2", "co"];

        info += "<b>Pollutants</b>: ";
        for (specie in marker.iaqi) {
            if (pollutants.indexOf(specie) >= 0)
                info += "<u>" + specie + "</u>:" + marker.iaqi[specie].v + " ";
        }
        info += "<br>";

        info += "<b>Weather</b>: ";
        for (specie in marker.iaqi) {
            if (pollutants.indexOf(specie) < 0)
                info += "<u>" + specie + "</u>:" + marker.iaqi[specie].v + " ";
        }
        info += "<br>";

        info += "<b>Attributions</b>: <small>";
        info += marker.attributions
            .map(
                (attribution) =>
                    "<a target=_ href='" +
                    attribution.url +
                    "'>" +
                    attribution.name +
                    "</a>"
            )
            .join(" - ");
        return info;
    });
}

function getMarkerAQI(markerUID) {
    return fetch(
        "https://api.waqi.info/feed/@" + markerUID + "/?token=45063d60883e4e40b7767cfde837e5af75139432"
    )
        .then((x) => x.json())
        .then((data) => {
            if (data.status != "ok") throw data.reason;
            return data.data;
        });
}

function init() {
    createMap();
}

init();

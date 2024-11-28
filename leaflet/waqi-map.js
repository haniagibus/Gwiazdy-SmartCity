let allMarkers = {};

function createMap() {
    var OpenStreetMap_Mapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    );

    let map = L.map(document.getElementById("leaflet-map"), {
        attributionControl: false,
        gestureHandling: true,
        zoomSnap: 0.1,
    })
        .setView([54.372158, 18.638306], 12) // Gdańsk coordinates
        .addLayer(OpenStreetMap_Mapnik);

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

            populateMarkers(map, bounds, true);
        });
    }, 1000);

    return map;
}

function populateMarkers(map, bounds, isRefresh) {
    // let bounds = "54.2,18.4,54.6,18.9"; // Hardcoded Gdańsk bounds
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
                }).addTo(map);

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
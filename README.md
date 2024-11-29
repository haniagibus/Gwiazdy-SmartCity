# Gwiazdy-SmartCity

created by: [Agnieszka Kulesz](https://github.com/agatherat), [Weronika Koterba](https://github.com/weronikakoterba), [Hania Gibus](https://github.com/haniagibus)

## Project description
Web application for assessing the ecological condition of the city - Gdańsk, and proposing solutions aimed at improving the quality of life of citizens. It enables users to visualize data such as air purity, availability of green areas and noise pollution.

## Prerequisites
1. Running Flask app on production server
2. User connected to the local network where Flask app is running _(for demonstration purposes WiFi SSID: CKS)_

## How to run
1. Open address in browser [http://172.16.177.107:8080/](http://172.16.177.107:8080/)
4. Enjoy all of the features :)

## Dependencies
1. Maps library: [Leaflet](https://leafletjs.com/)

## Data sources
1. Air Quality API: [World's Air Pollution](https://aqicn.org/api/)
2. Noise Pollution Map: [geogdansk](https://geogdansk.pl/app/pl/?lang=pl&layers=podklad_mapowy_gdansk_779362%2Cpodklad_mapowy_gdansk_779361%2Cpodklad_mapowy_gdansk_779349%2Cpodklad_mapowy_gdansk_779360%2Cpodklad_mapowy_gdansk_779363%2Cpodklad_mapowy_gdansk_779357%2Cpodklad_mapowy_gdansk_779359%2Cpodklad_mapowy_gdansk_779358%2Cpodklad_mapowy_gdansk_779321%2Cpodklad_mapowy_gdansk_779320%2Cpodklad_mapowy_gdansk_77931%2Cpodklad_mapowy_gdansk_779314%2Cpodklad_mapowy_gdansk_779313%2Cpodklad_mapowy_gdansk_779327%2Cpodklad_mapowy_gdansk_779316%2Cpodklad_mapowy_gdansk_779319%2Cpodklad_mapowy_gdansk_779325%2Cpodklad_mapowy_gdansk_779324%2Cpodklad_mapowy_gdansk_779315%2Cpodklad_mapowy_gdansk_779312%2Cpodklad_mapowy_gdansk_779311%2Cpodklad_mapowy_gdansk_779326%2Cpodklad_mapowy_gdansk_77939%2Cpodklad_mapowy_gdansk_77938%2Cpodklad_mapowy_gdansk_77932%2Cpodklad_mapowy_gdansk_779342%2Cpodklad_mapowy_gdansk_779340%2Cpodklad_mapowy_gdansk_779341%2Cpodklad_mapowy_gdansk_779333%2Cpodklad_mapowy_gdansk_779334%2Cpodklad_mapowy_gdansk_779335%2Cpodklad_mapowy_gdansk_779336%2Cpodklad_mapowy_gdansk_779337%2Cpodklad_mapowy_gdansk_779338%2Cpodklad_mapowy_gdansk_779339%2Cpodklad_mapowy_gdansk_77930%2Cpodklad_mapowy_gdansk_7793%2C18da7f003c0-layer-41%2C18da7f003c0-layer-40%2C18da7f003c0-layer-4%2C18da7f0dc1c-layer-170%2C18da7f0dc1c-layer-172%2C18da7f0dc1c-layer-17%2C18dacda06fc-layer-180%2C18dacda06fc-layer-18%2C18da8299e0c-layer-19%2C18da7f09e19-layer-140%2C18da7f09e19-layer-14%2C18da7f0ae6b-layer-154%2C18da7f0ae6b-layer-153%2C18da7f0ae6b-layer-156%2C18da7f0ae6b-layer-152%2C18da7f0ae6b-layer-151%2C18da7f0ae6b-layer-150%2C18da7f0ae6b-layer-15%2C18dacf70d84-layer-86%2C18dacf72833-layer-130&page=Strona-g%C5%82%C3%B3wna&s=50000&webMap=ca296694cd0145d9a3d1fe8db150d769&x=6540740.805712186&y=6025154.213030122)

## Leaflet Plugins Used
1. [leaflet.fullscreen](https://github.com/brunob/leaflet.fullscreen)
2. [L.switchBasemap](https://github.com/clavijojuan/L.switchBasemap)
3. [leaflet-control-geocoder](https://github.com/perliedman/leaflet-control-geocoder)

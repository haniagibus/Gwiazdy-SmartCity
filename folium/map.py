import folium

#Gdańsk
m = folium.Map(location=(54.3520, 18.6463))

import requests

# Sensor parameter
sensorReadings = [
    {'specie':'pm25', 'value': 393.3},
    {'specie':'pm10', 'value': 109.3}
]

# Station parameter
station = {
    'id':		"station-001",
    'location':  {
        'latitude': 28.7501,
        'longitude': 77.1177
    }
}

# User parameter - get yours from https://aqicn.org/data-platform/token/
userToken = "dummy-token-for-test-purpose-only"

# Then Upload the data
params = {'station':station,'readings':sensorReadings,'token':userToken}
request = requests.post( url = "https://aqicn.org/sensor/upload/",  json = params)
#print(request.text)
data = request.json()

if data["status"]!="ok":
    print("Something went wrong: %s" % data)
else:
    print("Data successfully posted: %s"%data)
m.save("index.html")


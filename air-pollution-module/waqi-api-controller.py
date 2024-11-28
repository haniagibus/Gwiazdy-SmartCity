import requests
import json

base_url = "https://api.waqi.info"
token = open('../tokens/.waqitoken').read()
city = 'Gdansk'

req = requests.get(base_url + f'/feed/{city}/?token={token}')

with open('air-pollution-data.json', 'w') as f:
    json.dump(req.json(), f)

# print(req.text)

import json
import random
import pygeoj
from geopy.distance import geodesic


MIN_LAT = 54.280413591262175
MAX_LAT = 54.40166428999922
MIN_LNG = 18.472751061148443
MAX_LNG = 18.804598263841513

MAX_NOISE_DISTANCE = 5


def generate_points(num):
    return [(random.uniform(MIN_LAT, MAX_LAT), random.uniform(MIN_LNG, MAX_LNG)) for _ in range(num)]


def get_coordinates_from_geojson(file_path):
    geo_file = pygeoj.load(file_path)
    coordinates = []

    for feature in geo_file:
        geometry_type = feature.geometry.type
        geometry_coords = feature.geometry.coordinates

        if geometry_type == "Polygon":
            for ring in geometry_coords:
                coordinates.extend(ring)
        elif geometry_type == "MultiPolygon":
            for polygon in geometry_coords:
                for ring in polygon:
                    coordinates.extend(ring)

    return coordinates


def evaluate_points(points, green_coordinates, noise_coordinates):
    evaluated_points = []

    for point in points:
        min_distance_to_noise = float("inf")
        for noise_point in noise_coordinates:
            distance = geodesic(point, (noise_point[1], noise_point[0])).km
            min_distance_to_noise = min(min_distance_to_noise, distance)

        if min_distance_to_noise > MAX_NOISE_DISTANCE:
            continue

        min_distance_to_green = float("inf")
        for green_point in green_coordinates:
            distance = geodesic(point, (green_point[1], green_point[0])).km
            min_distance_to_green = min(min_distance_to_green, distance)

        score = min_distance_to_green - 2 * min_distance_to_noise
        evaluated_points.append((point, score))

    return evaluated_points


def create_geojson(points, output_file):
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": (x, y)
                },
                "properties": {
                    "name": "Critical Point"
                }
            }
            for (y, x) in points
        ]
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)


points = generate_points(1000)
green_coordinates = get_coordinates_from_geojson("../static/geojson-data/green-terrains.geojson")
noise_coordinates = get_coordinates_from_geojson("../static/geojson-data/noise-pollution.geojson")

evaluated_points = evaluate_points(points, green_coordinates, noise_coordinates)

evaluated_points.sort(key=lambda x: x[1], reverse=True)
critical_points = [point for point, score in evaluated_points[:10]]

create_geojson(critical_points, "../static/geojson-data/critical-points.geojson")

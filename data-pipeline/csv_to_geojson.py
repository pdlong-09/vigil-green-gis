import csv
import json
import os

def csv_to_geojson(csv_filepath, geojson_filepath):
    features = []
    
    with open(csv_filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat = float(row['lat'])
                lon = float(row['lon'])
                
                # Extract numeric properties
                properties = {}
                for key, val in row.items():
                    if key in ['lat', 'lon', '.geo', 'system:index']:
                        continue
                    try:
                        properties[key] = float(val) if '.' in val else int(val)
                    except ValueError:
                        properties[key] = val # keep as string if not numeric
                
                # Generate a Point geometry (MapLibre can style this as circle or heatmap)
                # To simulate the neon outline polygon, MapLibre circle-stroke-* is sufficient and lighter.
                # If we really need Polygons, we can compute 1km offset here (approx 0.009 deg).
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": properties
                }
                features.append(feature)
            except ValueError:
                continue

    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    
    with open(geojson_filepath, 'w', encoding='utf-8') as f:
        json.dump(feature_collection, f, separators=(',', ':')) # compact

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(os.path.dirname(base_dir), 'data')
    
    input_file = os.path.join(data_dir, 'KBang_TEST_master_rain_elev_lossyear.csv')
    output_file = os.path.join(data_dir, 'KBang_TEST_master.geojson')
    
    if os.path.exists(input_file):
        csv_to_geojson(input_file, output_file)
        print(f"Generated {output_file}")
    else:
        print(f"Input file not found: {input_file}")

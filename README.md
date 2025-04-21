# Diskover Diliman
# OSRM
Setup OSRM in deployment server
```
# scripts/setup_osrm.sh
wget http://download.geofabrik.de/asia/philippines-latest.osm.pbf -O data/philippines-latest.osm.pbf
docker run --platform linux/amd64 -t -v "$PWD/data:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/philippines-latest.osm.pbf
docker run --platform linux/amd64 -t -v "$PWD/data:/data" osrm/osrm-backend osrm-partition /data/philippines-latest.osrm
docker run --platform linux/amd64 -t -v "$PWD/data:/data" osrm/osrm-backend osrm-customize /data/philippines-latest.osrm
```
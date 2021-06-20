import './../App.css';
import 'leaflet/dist/leaflet.css';
import {watMap, watPoints} from './jsonmap';
import ReactLeafletSearch from "react-leaflet-search";
import {Map, TileLayer} from 'react-leaflet';
import React, {useEffect, useRef} from 'react';
import L from 'leaflet';

const defaultCenter = [52.25315880118569, 20.899343490600586];
const defaultZoom = 16;

const markerIcon = L.icon({
    iconUrl: 'marker.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
});

function WatMap() {
    const mapRef = useRef();
    var locationLatLng = null;

    useEffect(() => {
        const {current = {}} = mapRef;
        const {leafletElement: map} = current;

        var layerPopup;

        function foreachfeature(feature, layer) {
            layer.setStyle({
                color: feature.properties.fill
            });
            layer.on('mouseover', function (e) {
                layer.setStyle({
                    fillOpacity: 0.9
                });
                if (map) {
                    layerPopup = L.popup();
                    layerPopup.setLatLng(e.latlng)
                    layerPopup.setContent('Building number ' + feature.properties.number)
                    layerPopup.openOn(map);
                }
            });
            layer.on('mouseout', function (e) {
                layer.setStyle({
                    fillOpacity: 0.4
                });
                map.closePopup();
            });
        }

        function onEachPoint(feature, layer) {
            layer.on('mouseover', function (e) {
                if (map) {
                    layerPopup = L.popup();
                    layerPopup.setLatLng(e.latlng)
                    layerPopup.setContent(feature.properties.name)
                    layerPopup.openOn(map);
                }
            });
            layer.on('mouseout', function (e) {
                map.closePopup();
            });
        }

        L.geoJson(watMap,
            {
                onEachFeature: foreachfeature,
                style: {
                    color: "#00008c",
                    fillOpacity: 0.4
                }
            }
        ).addTo(map);

        L.geoJson(watPoints,
            {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: markerIcon});
                }, onEachFeature: onEachPoint
            }
        )//.addTo(map);

        map.locate({
            setView: true,
        });

        map.on('locationfound', handleOnLocationFound);

        map.on('locationerror', handleOnLocationError);

        return () => {
            map.off('locationfound', handleOnLocationFound);
            map.off('locationerror', handleOnLocationError);
        }
    }, []);


    const customProvider = {
        search: async (inputValue) => {
            const {current = {}} = mapRef;
            const {leafletElement: map} = current;

            for (var i = 0; i < watMap.features.length; i++) {
                // eslint-disable-next-line
                if (watMap.features[i].properties.number === parseInt(inputValue)) {
                    map.setView(new L.LatLng(watMap.features[i].geometry.coordinates[0][0][1], watMap.features[i].geometry.coordinates[0][0][0]), 18);
                    console.log(watMap.features[i].geometry.coordinates[0][0]);
                    break;
                }
            }
        }
    }

    /**
     * handleOnLocationFound
     * @param {object} event Leaflet LocationEvent object
     */

    function handleOnLocationFound(event) {
        const {current = {}} = mapRef;
        const {leafletElement: map} = current;

        locationLatLng = event.latlng;
        const radius = event.accuracy;
        const circle = L.circle(locationLatLng, radius);

        circle.on('mouseover', function (e) {
            circle.setStyle({
                fillOpacity: 0.9
            });
            if (map) {
                var layerPopup = L.popup();
                layerPopup.setLatLng(e.latlng)
                layerPopup.setContent('You are here')
                layerPopup.openOn(map);
            }
        });

        circle.on('mouseout', function (e) {
            circle.setStyle({
                fillOpacity: 0.4
            });
            map.closePopup();
        });

        circle.addTo(map);
    }

    /**
     * handleOnLocationError
     * @param {object} error Leaflet ErrorEvent object
     */

    function handleOnLocationError(error) {
        alert(`Unable to determine location: ${error.message}`);
    }

    return (
        <div className="WatMap">
            <Map ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
                <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                           attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"/>
                <ReactLeafletSearch position="topleft" customProvider={customProvider} inputValue=" "
                                    inputPlaceholder="Enter building number"/>;
            </Map>
        </div>
    );
}

export default WatMap;

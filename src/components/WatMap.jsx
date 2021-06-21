import './../App.css';
import 'leaflet/dist/leaflet.css';
import {watMap} from './jsonmap';
import ReactLeafletSearch from "react-leaflet-search";
import { Map, TileLayer} from 'react-leaflet';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [52.25315880118569, 20.899343490600586];
const defaultZoom = 16;

const URL = "https://wat-map-database.herokuapp.com"
//const URL = "http://localhost:8080"

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: require("./marker-icon-red.png"),
  shadowUrl: require("./marker-shadow.png"),
});

const entranceIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: require("./marker-icon.png"),
  shadowUrl: require("./marker-shadow.png"),
});

function WatMap() {
  const mapRef = useRef();
  var locationLatLng = null;
  var state = {
    faculty:null
  }

  useEffect(() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

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

            console.log(URL + '/faculties/short/' + feature.properties.Wydzial)
            axios.get(URL + '/faculties/short/' + feature.properties.Wydzial)
            .then(res=>{
                  state.faculty = res.data
                  layerPopup = L.popup();
                  layerPopup.setLatLng(e.latlng)
                  console.log(state.faculty);
                  if(state.faculty !== null) {
                    var content = ""
                    if (feature.properties.number !== 0) {
                      content += '<b>Building number : </b>'+ feature.properties.number + "<br>"
                    }
                    content += '<b>Faculty : </b>' + state.faculty.name + "<br>"
                    content += '<b>Webpage : </b>' + state.faculty.url
                    layerPopup.setContent(content)
                  }
                  layerPopup.openOn(map);
            })
            .catch(err=>console.log(err))
          }
      });
      layer.on('mouseout', function (e) {
          layer.setStyle({
              fillOpacity: 0.4
          });
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



      var entrances = L.control({position: 'bottomleft'});

      entrances.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'entrances');
          div.innerHTML = '<form><input id="entrances" type="checkbox"/>Entrances <br> <input id="food" type="checkbox"/>Food</form>'; 
          return div;
      };

      entrances.addTo(map);

      var layerEntrances = L.layerGroup().addTo(map);
      function handleEntrances() {
        if (this.checked) {
          axios.get(URL + '/faculties/short/entrances').then(res=>{
            if (res.status === 200) {
              console.log(res.data)
              res.data.institutes.forEach(element => {
                var marker = L.marker([element.latitude, element.longitude], {icon: entranceIcon})
                marker.bindPopup(element.name).openPopup()
                marker.addTo(layerEntrances)
              });
              layerEntrances.addTo(map)
            }
          })
        } else {
          layerEntrances.clearLayers()
        }
      }

      var layerFood = L.layerGroup().addTo(map);
      function handleFood() {
        if (this.checked) {
          var marker = L.marker([52.25314070439501, 20.87948585041667], {icon: markerIcon})
          marker.bindPopup().openPopup()
          marker.addTo(layerFood)
          layerFood.addTo(map)
        } else {
          layerFood.clearLayers()
        }
      }

      document.getElementById ("food").addEventListener ("click", handleFood, false);
      document.getElementById ("entrances").addEventListener ("click", handleEntrances, false);

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
      const { current = {} } = mapRef;
      const { leafletElement: map } = current;

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
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

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
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
        <ReactLeafletSearch position="topleft" customProvider={customProvider} inputValue=" "
        inputPlaceholder="Enter building number"/>;
      </Map>
    </div>
  );
}

export default WatMap;

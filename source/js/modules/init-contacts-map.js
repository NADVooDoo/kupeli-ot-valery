import {map as createMap, tileLayer as createTitleLayers, icon as createIcon, marker as createMarker} from '../vendor/leaflet';

const getMap = () => {
  const mapElement = document.querySelector('#map');
  if (!mapElement) {
    return;
  }

  mapElement.querySelector('picture').remove();

  const coordinate = [54.683517, 39.603954];
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const markerText = `
  <p>г. Рязань, ул. Прижелезнодорожная 30</p>
  <p>Номера телефонов:<br><a href="tel:+79209528421">+7 920 952 84 21</a><br><a href="tel:+79036816874">+7 903 681 68 74</a></p>
  `;

  const map = createMap('map', {
    center: coordinate,
    zoom: 14,
    scrollWheelZoom: false,
  });

  const icon = createIcon({
    iconUrl: './img/svg/map-marker.svg',
    iconSize: [70, 70],
    iconAnchor: [40, 70],
  });

  createTitleLayers(tileUrl).addTo(map);
  createMarker(coordinate, {icon}).bindPopup(markerText).addTo(map);
};

export {getMap};

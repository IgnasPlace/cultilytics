import maplibregl from "maplibre-gl";

export default async function (map, markerData) {
  const markerStore = useStore("markers");
  const { allMarkers } = storeToRefs(markerStore);

  const marker = new maplibregl.Marker({
    color: markerData.color,
  });

  marker._element.id = `marker-${markerData.id}`;

  markerStore.addMarker(marker, markerData);

  marker
    .setLngLat([markerData.lng, markerData.lat])
    .setPopup(new maplibregl.Popup().setHTML(`<p>ID: ${markerData.id}</p>`));

  setTimeout(() => marker.addTo(map), 0);

  marker.getElement().addEventListener("click", (e) => {
    e.stopPropagation();

    const id = marker._element.id.split("-")[1];
    for (const [key, value] of Object.entries(allMarkers.value)) {
      value.maplibreInstance._popup.remove();
    }

    marker.togglePopup();

    markerStore.setCurrentMarker(allMarkers.value[id]);
  });
}

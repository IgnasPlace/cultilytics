<template>
  <div class="main-container">
    <div ref="mapContainer" class="map-container"></div>
    <AddMarker @addMarkerToMap="addNewMarkerToMap" />
  </div>
</template>

<script setup>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
const config = useRuntimeConfig();
console.log(config);

const mapContainer = ref(null);
let map;

const markerStore = useStore("markers");
const { addMarkerMode, currentUnsavedMarker } = storeToRefs(markerStore);

onMounted(async () => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/satellite/style.json?key=${config.public.maptiler_key}`,
    center: [-0.654144056839913, 39.6823177364732],
    zoom: 17,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");

  map.on("load", () => {
    loadAllMarkers(map);
  });

  map.on("click", (e) => {
    if (addMarkerMode.value === "add") {
      const marker = new maplibregl.Marker({
        color: "#B95E82",
        draggable: true,
      }).setLngLat(e.lngLat);

      markerStore.setActivateAddMarkerMode("selected");
      markerStore.setCurrentUnsavedMarker(marker);

      setTimeout(() => marker.addTo(map), 0);
    }
  });
});

const loadAllMarkers = async (map) => {
  const markers = await $fetch("/api/marker");
  // Load new markers
  markers.forEach((markerData) => {
    addNewMarkerToMap(markerData);
  });
};

const addNewMarkerToMap = (markerData) => {
  useAddNewMarker(map, markerData);
};
</script>

<style scoped>
.main-container {
  height: 100vh;
  width: 100vw;
  position: relative;
}
.map-container {
  height: 100%;
  width: 100%;
}
.add-btn {
  position: absolute;
  background-color: #fff;
  padding: 2px 8px;
  font-size: 12px;
  z-index: 10;
  bottom: 2.5rem;
  right: 0.7rem;
  border-radius: 4px;
  box-shadow: 2px 2px 2px #00000070;
}
</style>

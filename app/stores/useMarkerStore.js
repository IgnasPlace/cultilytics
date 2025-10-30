import { defineStore } from "pinia";

export const useMarkerStore = defineStore("marker", () => {
  const allMarkers = ref({});

  const currentSavedMarker = ref(null);
  const currentUnsavedMarker = ref(null);

  const addMarkerMode = ref("off");

  function addMarker(marker, markerData) {
    allMarkers.value[markerData.id] = {
      maplibreInstance: marker,
      ...markerData,
    };
  }

  function updateMarker(id, newData) {
    console.log(id);
  }

  function deleteMarker(id) {
    delete allMarkers.value[id];
  }

  function setCurrentMarker(marker) {
    currentSavedMarker.value = marker;
  }

  function setCurrentUnsavedMarker(marker) {
    currentUnsavedMarker.value = marker;
  }

  function setActivateAddMarkerMode(v) {
    console.log(v);
    addMarkerMode.value = v;
  }

  return {
    allMarkers,
    currentSavedMarker,
    currentUnsavedMarker,
    addMarkerMode,
    addMarker,
    updateMarker,
    deleteMarker,
    setCurrentMarker,
    setActivateAddMarkerMode,
    setCurrentUnsavedMarker,
  };
});

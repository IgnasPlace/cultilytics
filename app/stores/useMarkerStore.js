import { defineStore } from "pinia";

export const useMarkerStore = defineStore("marker", () => {
  const savedMarkers = ref([]);

  const currentUnsavedMarker = ref(null);
  const currentSelectedMarker = ref(null);

  const allMarkers = computed(() => {
    if (currentUnsavedMarker.value) {
      const ma = savedMarkers.value.concat([currentUnsavedMarker.value]);
      return ma;
    } else {
      return savedMarkers.value;
    }
  });

  const addMarkerMode = ref("off");
  const currentPopup = ref(null);
  const showInfoWidget = ref(false);

  function addMarker(markerData) {
    savedMarkers.value.push(markerData);
  }
  function setSavedMarkers(markerData) {
    savedMarkers.value = markerData;
  }
  function setCurrentSelectedMarker(v) {
    currentSelectedMarker.value = v;
  }

  function updateMarker(id, newData) {
    // todo
    // update marker
  }

  function deleteMarker(id) {
    const index = savedMarkers.value.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      savedMarkers.value.splice(index, 1);
    }
    return savedMarkers.value;
  }

  function setCurrentUnsavedMarker(marker) {
    currentUnsavedMarker.value = marker;
  }

  function setActivateAddMarkerMode(v) {
    addMarkerMode.value = v;
  }
  function closeInfoWidget() {
    showInfoWidget.value = false;
  }

  return {
    savedMarkers,
    allMarkers,
    currentSelectedMarker,
    currentUnsavedMarker,
    addMarkerMode,
    currentPopup,
    showInfoWidget,
    addMarker,
    setSavedMarkers,
    updateMarker,
    deleteMarker,
    setActivateAddMarkerMode,
    setCurrentUnsavedMarker,
    setCurrentSelectedMarker,
    closeInfoWidget,
  };
});

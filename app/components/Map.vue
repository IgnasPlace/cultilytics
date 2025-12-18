<template>
  <div class="w-dvw h-dvh relative text-xs">
    <MglMap :map-style="style" :center="center" :zoom="zoom">
      <MglNavigationControl position="bottom-right" />
      <MglScaleControl position="bottom-left" />
      <MglMarker
        v-for="(marker, idx) in allMarkers"
        :key="idx"
        ref="markers"
        :coordinates="[marker.lng, marker.lat]"
        :color="marker.color"
        :draggable="marker.draggable"
        @dragend="handleDragEnd"
      >
        <MglPopup
          v-if="marker.id"
          ref="popups"
          :close-button="false"
          @open="(e) => handlePopupOpen(idx)"
          @close="(e) => handlePopupClose(idx)"
        >
          <h1 class="text-xl text-center">{{ marker.id }}</h1>
          <p class="text-center mb-2">{{ marker.name }}</p>
          <button
            @click="() => showMoreInfo(marker)"
            class="bg-green-200 py-1 px-2 rounded-md"
            type="button"
          >
            More info
          </button>
        </MglPopup>
      </MglMarker>
    </MglMap>
    <WidgetInfo
      v-if="showInfoWidget && currentSelectedMarker"
      :data="currentSelectedMarker"
    />
    <AddMarker v-else />
    <WidgetUser />
  </div>
</template>

<script setup>
import "maplibre-gl/dist/maplibre-gl.css";
import { useMap } from "@indoorequal/vue-maplibre-gl";

const config = useRuntimeConfig();

let map;

const markerStore = useStore("markers");
const {
  addMarkerMode,
  currentPopup,
  showInfoWidget,
  allMarkers,
  currentSelectedMarker,
  currentUnsavedMarker,
} = storeToRefs(markerStore);

const style = config.public.maptiler_satellite_url;
const center = [config.public.map_lng, config.public.map_lat];
const zoom = 17;

const markerInstances = useTemplateRef("markers");
const popupInstances = useTemplateRef("popups");

onMounted(async () => {
  map = useMap().map;

  map.on("load", () => {
    loadAllMarkers(map);
  });

  map.on("click", (e) => {
    if (addMarkerMode.value === "add") {
      markerStore.setActivateAddMarkerMode("selected");
      markerStore.setCurrentUnsavedMarker({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        id: "",
        name: "",
        nameLatin: "",
        type: "Tree",
        color: "#B95E82",
        draggable: true,
      });
    }
  });
});

const loadAllMarkers = async (map) => {
  try {
    const markers = await $fetch("/api/marker");

    markerStore.setSavedMarkers(markers);
  } catch (err) {
    console.log(err);
  }
};

const showMoreInfo = (marker) => {
  currentPopup.value.remove();
  currentPopup.value = null;
  showInfoWidget.value = true;
  currentSelectedMarker.value = marker;
};

const handlePopupOpen = async (idx) => {
  await nextTick();
  currentPopup.value = popupInstances.value[idx];
};
const handlePopupClose = (e) => {
  currentPopup.value = null;
};

const handleDragEnd = (e) => {
  currentUnsavedMarker.value.lng = e.target._lngLat.lng;
  currentUnsavedMarker.value.lat = e.target._lngLat.lat;
};
</script>

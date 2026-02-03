import { defineStore } from "pinia";
import { ref, computed, type Ref, type ComputedRef } from "vue";

export interface Marker {
  id: string;
  userId?: number;
  lat?: number;
  lng?: number;
  type: string;
  color: string;
  name: string;
  nameLatin?: string;
  createdAt?: Date;
  updatedAt?: Date;
  markerImage?: MarkerImage[];
}

export interface MarkerImage {
  id: number;
  markerId: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarkerStore {
  savedMarkers: Ref<Marker[]>;
  allMarkers: ComputedRef<Marker[]>;
  currentSelectedMarker: Ref<Marker | null>;
  currentUnsavedMarker: Ref<Marker | null>;
  addMarkerMode: Ref<string>;
  currentPopup: Ref<any>;
  showInfoWidget: Ref<boolean>;
  addMarker: (markerData: Marker) => void;
  setSavedMarkers: (markerData: Marker[]) => void;
  updateMarker: (id: string, newData: Partial<Marker>) => void;
  deleteMarker: (id: string) => Marker[];
  setActivateAddMarkerMode: (v: string) => void;
  setCurrentUnsavedMarker: (marker: Marker | null) => void;
  setCurrentSelectedMarker: (v: Marker | null) => void;
  closeInfoWidget: () => void;
  addMarkerImages: (id: string, data: MarkerImage[]) => void;
  deleteMarkerImage: (markerId: string, imageId: number) => void;
}

export const useMarkerStore = defineStore("marker", (): MarkerStore => {
  const savedMarkers = ref<Marker[]>([]);

  const currentUnsavedMarker = ref<Marker | null>(null);
  const currentSelectedMarker = ref<Marker | null>(null);

  const allMarkers = computed<Marker[]>(() => {
    if (currentUnsavedMarker.value) {
      const ma = savedMarkers.value.concat([currentUnsavedMarker.value]);
      return ma;
    } else {
      return savedMarkers.value;
    }
  });

  const addMarkerMode = ref<string>("off");
  const currentPopup = ref<any>(null);
  const showInfoWidget = ref<boolean>(false);

  function addMarker(markerData: Marker): void {
    savedMarkers.value.push(markerData);
  }
  function setSavedMarkers(markerData: Marker[]): void {
    savedMarkers.value = markerData;
  }
  function setCurrentSelectedMarker(v: Marker | null): void {
    currentSelectedMarker.value = v;
  }

  function updateMarker(id: string, newData: Partial<Marker>): void {
    // todo
    // update marker
  }

  function addMarkerImages(id: string, data: MarkerImage[]): void {
    const marker = savedMarkers.value.find((m) => m.id === id);
    if (marker) {
      data.forEach((img) => {
        if (!marker.markerImage) {
          marker.markerImage = [];
        }
        marker.markerImage.push(img);
      });
    }
  }

  function deleteMarkerImage(markerId: string, imageId: number): void {
    const marker = savedMarkers.value.find((m) => m.id === markerId);
    if (marker && marker.markerImage) {
      const imageIndex = marker.markerImage.findIndex((img) => img.id === imageId);
      if (imageIndex !== -1) {
        marker.markerImage.splice(imageIndex, 1);
      }
    }

    if (currentSelectedMarker.value && currentSelectedMarker.value.id === markerId) {
      const imageIndex = currentSelectedMarker.value.markerImage?.findIndex(
        (img) => img.id === imageId
      );
      if (imageIndex !== undefined && imageIndex !== -1 && currentSelectedMarker.value.markerImage) {
        currentSelectedMarker.value.markerImage.splice(imageIndex, 1);
      }
    }
  }

  function deleteMarker(id: string): Marker[] {
    const index = savedMarkers.value.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      savedMarkers.value.splice(index, 1);
    }
    return savedMarkers.value;
  }

  function setCurrentUnsavedMarker(marker: Marker | null): void {
    currentUnsavedMarker.value = marker;
  }

  function setActivateAddMarkerMode(v: string): void {
    addMarkerMode.value = v;
  }
  function closeInfoWidget(): void {
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
    addMarkerImages,
    deleteMarkerImage,
  };
});

import type { Marker } from "@/stores/useMarkerStore";

interface SaveMarkerResponse {
  message?: string;
}

export default async function useSaveNewMarker(body: Marker): Promise<SaveMarkerResponse> {
  const res = await $fetch<SaveMarkerResponse>("/api/marker", {
    method: "POST",
    body,
    onResponse({ response }) {
      const toast = useToast();
      if (!response.ok) {
        console.log(response._data.message);
        let msg = response._data.message;
        if (response._data.message === "UNIQUE constraint failed: marker.id") {
          msg = "ID must be unique.";
        }
        toast.error({
          title: "Error",
          message: msg,
          position: "topCenter",
        });

        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const markerStore = useStore("markers");
        markerStore.setCurrentUnsavedMarker(null);
        markerStore.addMarker(body);
        markerStore.setActivateAddMarkerMode("off");
        toast.success({
          title: "Success!",
          message: "Marker saved successfully.",
          position: "topCenter",
        });
      }
    },
    onResponseError({ response }) {
      const errorData = response._data || response.statusText;

      if (response.status === 401) {
        throw new Error("Authentication required");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else {
        throw new Error(`API error: ${errorData}`);
      }
    },
  });
  return res;
}

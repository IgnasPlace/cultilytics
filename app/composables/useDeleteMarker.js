export default async function (id) {
  const res = await $fetch("/api/marker", {
    method: "DELETE",
    body: { id },
    onResponse({ response }) {
      const toast = useToast();
      if (!response.ok) {
        console.error(response._data.message);

        toast.error({
          title: "Error",
          message: response._data.message,
          position: "topCenter",
        });

        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const markerStore = useStore("markers");
        markerStore.deleteMarker(id);
        markerStore.setCurrentSelectedMarker(null);
        markerStore.closeInfoWidget();
        toast.success({
          title: "Marker Deleted.",
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

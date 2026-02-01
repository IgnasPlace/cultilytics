export default async function (imageId, markerId) {
  const res = await $fetch(`/api/marker-image/${imageId}`, {
    method: "DELETE",
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
        markerStore.deleteMarkerImage(markerId, parseInt(imageId, 10));
        toast.success({
          title: "Image Deleted",
          position: "topCenter",
        });
      }
    },
    onResponseError({ response }) {
      const errorData = response._data || response.statusText;

      if (response.status === 401) {
        throw new Error("Authentication required");
      } else if (response.status === 403) {
        throw new Error("Permission denied");
      } else if (response.status === 404) {
        throw new Error("Image not found");
      } else {
        throw new Error(`API error: ${errorData}`);
      }
    },
  });
  return res;
}

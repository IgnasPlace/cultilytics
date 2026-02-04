import "maplibre-gl/dist/maplibre-gl.css";
import VueMaplibreGl from "@indoorequal/vue-maplibre-gl";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMaplibreGl);
});

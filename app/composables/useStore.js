import { useMarkerStore } from "@/stores/useMarkerStore";

export default function (store) {
  switch (store) {
    case "markers":
      return useMarkerStore();
  }
}

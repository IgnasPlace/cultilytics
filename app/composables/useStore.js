import { useMarkerStore } from "@/stores/useMarkerStore";
import { useUserStore } from "@/stores/useUserStore";

export default function (store) {
  switch (store) {
    case "markers":
      return useMarkerStore();
    case "user":
      return useUserStore();
  }
}

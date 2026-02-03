import { useMarkerStore } from "@/stores/useMarkerStore";
import { useUserStore } from "@/stores/useUserStore";
import type { StoreGeneric } from "pinia";

type StoreName = "markers" | "user";

export default function useStore(store: "markers"): ReturnType<typeof useMarkerStore>;
export default function useStore(store: "user"): ReturnType<typeof useUserStore>;
export default function useStore(store: StoreName): StoreGeneric {
  switch (store) {
    case "markers":
      return useMarkerStore();
    case "user":
      return useUserStore();
  }
}

import { useContext } from "react";
import { RecentActivityContext } from "../context/RecentActivityContext";

export function useRecentActivity() {
  return useContext(RecentActivityContext);
}






import { useContext } from "react";
import { RecentActivityContext } from "../context/RecentActivity";

export function useRecentActivity() {
  return useContext(RecentActivityContext);
}




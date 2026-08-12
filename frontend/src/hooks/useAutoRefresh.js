import { useEffect } from "react";

function useAutoRefresh(callback, delay = 10000) {

  useEffect(() => {

    if (!callback) return;

    const interval = setInterval(() => {
      callback();
    }, delay);

    return () => clearInterval(interval);

  }, [callback, delay]);

}

export default useAutoRefresh;

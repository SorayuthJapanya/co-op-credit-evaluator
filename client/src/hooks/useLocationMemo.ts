import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useLocationMemo = () => {
  const location = useLocation();
  
  return useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    key: location.key,
  }), [location.pathname, location.search, location.hash, location.state, location.key]);
};

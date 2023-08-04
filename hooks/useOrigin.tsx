import { useState, useMemo, useLayoutEffect } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const origin = useMemo(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    // Provide a default value here or throw an error if needed.
    return "";
  }, []);

  if (!mounted) {
    return null;
  }

  return origin;
};

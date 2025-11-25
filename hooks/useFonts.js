import { useState, useEffect } from "react";

export default function useFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // simulate async load
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800); // simulate ~1s font load
    return () => clearTimeout(timer);
  }, []);

  return loaded;
}

import { useEffect, useRef, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function useLocomotiveScroll(options = {}) {
  const containerRef = useRef(null);
  const [scrollInstance, setScrollInstance] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // শুধু একবার init করো
    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      lerp: 0.07,
      smartphone: {
        smooth: true, // mobile enable smooth
      },
      tablet: {
        smooth: true, // tablet enable smooth
      },
      ...options,
    });

    setScrollInstance(scroll);

    return () => {
      scroll.destroy();
      setScrollInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, scrollInstance };
}

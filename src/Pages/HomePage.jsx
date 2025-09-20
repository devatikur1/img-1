import React, { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";

// locomotive-scroll-css
import useLocomotiveScroll from "../Hooks/useLocomotiveScroll";

// components
import UploadFeed from "../components/Home/UploadFeed";
import ImageFeed from "../components/Home/ImageFeed";

export default function HomePage() {

  const { images, isUserUploadingImage} = useContext(FirebaseContext);


  // Hook থেকে ref আর instance নাও
  const { containerRef, scrollInstance } = useLocomotiveScroll({
    smooth: true,
    lerp: 0.07,
  });

  // scroll pause/resume control
  useEffect(() => {
    if (!scrollInstance) return;
    if (isUserUploadingImage) {
      scrollInstance.stop();
      document.body.classList.add("overflow-hidden");
    } else {
      scrollInstance.start();
      document.body.classList.remove("overflow-hidden");
    }

    // ✅ Change: cleanup on unmount
    return () => {
      scrollInstance.start();
      document.body.classList.remove("overflow-hidden");
    };
  }, [isUserUploadingImage, scrollInstance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollInstance) scrollInstance.update();
    }, 500);
    return () => clearTimeout(timer);
  }, [scrollInstance, images]);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-screen w-full flex flex-col home pt-[62px]"
    >
      {/* Preview Area */}
      <ImageFeed />

      {/* upload feed */}
      <UploadFeed />

    </div>
  );
}

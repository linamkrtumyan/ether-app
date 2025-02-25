import React, { useState } from "react";
import video from "../../../public/preview.mp4";
import preview from "../../../public/preview.webp";

export const Background: React.FC = () => {
  const [showPoster, setShowPoster] = useState(false);

  const handleVideoEnd = () => {
    setShowPoster(true);
  };

  return (
    <div className="relative w-full h-screen">
      {showPoster ? (
        <img
          src={preview}
          alt="Video Preview"
          className="w-full h-full object-cover rounded-lg shadow-lg z-10"
        />
      ) : (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          controls
          autoPlay
          muted
          poster={preview}
          onEnded={handleVideoEnd}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};


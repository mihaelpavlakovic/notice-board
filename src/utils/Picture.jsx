import React, { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Picture = ({ src, alt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const overlayRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOverlayClick = event => {
    if (event.target === overlayRef.current) {
      toggleModal();
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-20 cursor-pointer object-cover"
        onClick={toggleModal}
      />

      {isModalOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleOverlayClick}
        >
          <div className="relative max-w-screen-lg mx-auto">
            <div className="relative">
              <img src={src} alt={alt} className="w-[50vw]" />
              <button
                className="absolute top-2 right-2 p-2 bg-white rounded-full"
                onClick={toggleModal}
              >
                <XMarkIcon className="h-5 w-5 text-gray-700 hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Picture;

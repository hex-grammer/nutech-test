import React, { useRef, useState } from "react";
import { FcAddImage } from "react-icons/fc";
import Image from "next/image";
import { FileUploader } from "react-drag-drop-files";

interface Props {
  onMediaChange: (media: File) => void;
  imagePreview?: string | null;
}

const MediaUploader: React.FC<Props> = ({ onMediaChange, imagePreview }) => {
  const [isImage, setIsImage] = useState(!!imagePreview);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (file: File) => {
    setIsImage(true);
    onMediaChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleMediaChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const imageTypes = ["jpg", "png"];

  return (
    <div
      className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-gray-200 py-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <div className="absolute left-0 top-0 h-full w-full opacity-60">
        {isImage && imagePreview && (
          <Image
            src={imagePreview}
            alt="Image Preview"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        )}
      </div>
      <FileUploader
        handleChange={handleMediaChange}
        name="media"
        types={imageTypes}
      >
        <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg  p-10 text-center font-semibold text-gray-500 sm:h-44 sm:w-96 sm:border-none sm:p-2">
          <div className="flex flex-col items-center gap-1 underline">
            <FcAddImage className="text-4xl" />
            Upload Gambar
          </div>
        </div>
      </FileUploader>
    </div>
  );
};

export default MediaUploader;

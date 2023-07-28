import React, { useState } from "react";
import type { Barang } from "~/utils/types";
import { toast, ToastContainer } from "react-toastify";
import MediaUploader from "./MediaUploader";

interface Props {
  barang: Barang;
  onSubmit: (submittedBarang: Barang) => void;
  onCancel: () => void;
}

const InputBarang: React.FC<Props> = ({ barang, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Barang>(barang);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFotoChange = (file: File) => {
    // Validate file format (only JPG and PNG)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    console.log(file.type);
    if (allowedTypes.includes(file.type)) {
      // Validate file size (max 100KB)
      if (file.size <= 100 * 1024) {
        setFormData({
          ...formData,
          foto: file,
        });

        // Generate image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Batas maksimal ukuran file adalah 100KB.");
      }
    } else {
      toast.error("Hanya file JPG dan PNG yang diperbolehkan.");
    }
  };

  const handleCancel = () => {
    setFormData(barang);
    onCancel();
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-w-[92%] rounded-lg bg-white p-4 shadow-md sm:min-w-fit">
      <MediaUploader
        onMediaChange={handleFotoChange}
        imagePreview={imagePreview}
      />
      <div className="grid max-w-sm grid-cols-1 gap-1">
        <label className="mt-2">Nama Barang</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Harga Beli</label>
        <input
          type="number"
          name="harga_beli"
          value={formData.harga_beli}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Harga Jual</label>
        <input
          type="number"
          name="harga_jual"
          value={formData.harga_jual}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Stok</label>
        <input
          type="number"
          name="stok"
          value={formData.stok}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
      </div>
      <div className="mt-4 flex justify-between gap-4 sm:justify-end">
        <button
          onClick={handleCancel}
          className="w-full rounded-md bg-gray-400 px-4 py-2 text-white sm:w-fit"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white sm:w-fit"
        >
          Submit
        </button>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default InputBarang;

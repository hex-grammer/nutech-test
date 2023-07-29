import React, { useState } from "react";
import type { Barang } from "~/utils/types";
import { toast, ToastContainer } from "react-toastify";
import MediaUploader from "./MediaUploader";
import axios, { type AxiosResponse } from "axios";

interface Props {
  // barang: Barang;
  // onSubmit: (submittedBarang: Barang) => boolean;
  onCancel: () => void;
}

const initialBarang: Barang = {
  id: 1,
  foto: "",
  nama: "",
  harga_beli: 0,
  harga_jual: 0,
  stok: 0,
};

const InputBarang: React.FC<Props> = ({ onCancel }) => {
  const [barang, setBarang] = useState<Barang>(initialBarang);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarang({
      ...barang,
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
        setBarang({
          ...barang,
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
    setBarang(barang);
    onCancel();
  };

  const handleSubmit = () => {
    // If the barang state is empty, alert complete form and return
    if (
      barang.foto === initialBarang.foto ||
      barang.nama === initialBarang.nama
    ) {
      toast.error("Mohon lengkapi data barang!");
      return;
    }

    // Create a new FormData from barang.file object to send the file to the API endpoint
    const formFoto = new FormData();
    formFoto.append("image", barang.foto as Blob);

    // Send the image to the API endpoint
    axios
      .post(process.env.NEXT_PUBLIC_STORAGE ?? "", formFoto)
      .then((response: AxiosResponse<{ imageUrl: string }>) => {
        // Get the imageUrl from the response
        const imageUrl = response.data.imageUrl;

        console.log(response.data);

        // custom dataBarang to send (remove id and reaplace foto with imageUrl)
        const { id, ...dataBarang } = { ...barang, foto: imageUrl };

        // Send the POST request to the /api/materi/create endpoint with the updated data
        axios
          .post("/api/barang/create", dataBarang)
          .then(() => {
            toast.success("Data berhasil disimpan!");
            setBarang(barang);
            onCancel();
          })
          .catch(() => {
            toast.error("Data tidak tersimpan!");
          });
      })
      .catch(() => {
        toast.error("Gambar tidak tersimpan!");
      });
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
          value={barang.nama}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Harga Beli</label>
        <input
          type="number"
          name="harga_beli"
          value={barang.harga_beli}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Harga Jual</label>
        <input
          type="number"
          name="harga_jual"
          value={barang.harga_jual}
          onChange={handleChange}
          className="w-full rounded-sm border bg-gray-100 px-2 py-1 outline-blue-500"
        />
        <label className="mt-2">Stok</label>
        <input
          type="number"
          name="stok"
          value={barang.stok}
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
    </div>
  );
};

export default InputBarang;

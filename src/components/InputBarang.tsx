import React, { useState } from "react";
import type { Barang } from "~/utils/types";
import { toast, ToastContainer } from "react-toastify";
import MediaUploader from "./MediaUploader";
import axios, { type AxiosResponse } from "axios";

interface Props {
  editBarang?: Barang;
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

const InputBarang: React.FC<Props> = ({ editBarang, onCancel }) => {
  const initialImage =
    `${process.env.NEXT_PUBLIC_IMAGE_URL}${editBarang?.foto as string}` ?? null;
  const [barang, setBarang] = useState<Barang>(editBarang ?? initialBarang);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);

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
    // set loading true
    // setLoading(true);

    // If the barang state is empty, alert complete form and return
    if (!barang.foto || !barang.nama) {
      // toast error
      toast.error("Mohon lengkapi data barang!");

      // set loading false
      // setLoading(false);
      return;
    }

    // Define the data to be sent to the API
    const dataBarang: Barang = { ...barang };

    // Check if the data has changed
    const hasDataChanged =
      JSON.stringify(dataBarang) !== JSON.stringify(editBarang);

    if (!hasDataChanged) {
      // Data has not changed, no need to make the API call
      // setLoading(false);
      onCancel();
      return;
    }

    // Check if barang.foto is a File object (not a string)
    if (typeof barang.foto !== "string") {
      const formFoto = new FormData();
      formFoto.append("image", barang.foto as Blob);

      // Send the image to the API endpoint
      axios
        .post(process.env.NEXT_PUBLIC_STORAGE ?? "", formFoto)
        .then((response: AxiosResponse<{ imageUrl: string }>) => {
          // Get the imageUrl from the response
          const imageUrl = response.data.imageUrl;

          // Set the imageUrl in the data to be sent
          dataBarang.foto = imageUrl;

          // Send the dataBarang to the /api/barang/create endpoint
          submitDataBarang(dataBarang);
        })
        .catch(() => {
          toast.error("Gambar tidak tersimpan!");
          // setLoading(false);
        });
    } else {
      // If barang.foto is already an imageUrl, directly send the dataBarang to the /api/barang/create endpoint
      submitDataBarang(dataBarang);
    }
  };

  const submitDataBarang = (dataBarang: Barang) => {
    axios
      .post("/api/barang/create", dataBarang)
      .then(() => {
        editBarang
          ? toast.success("Data berhasil diedit!")
          : toast.success("Data berhasil disimpan!");
        setBarang(dataBarang);
        onCancel();
      })
      .catch(() => {
        editBarang
          ? toast.success("Data tidak berhasil diedit!")
          : toast.error("Data tidak tersimpan!");
      })
      .finally(() => {
        // setLoading(false);
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

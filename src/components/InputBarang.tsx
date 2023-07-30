import React, { useState } from "react";
import type { Barang } from "~/utils/types";
import { toast } from "react-toastify";
import MediaUploader from "./MediaUploader";
import axios, { type AxiosResponse } from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarang({
      ...barang,
      [name]: value,
    });
  };

  const handleFotoChange = (file: File) => {
    // Hanya terima JPG dan PNG
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.type)) {
      // Ukuran maximum file: 100KB
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
    setLoading(true);

    // Jika foto atau nama kosong
    if (!barang.foto || !barang.nama) {
      setLoading(false);
      toast.error("Mohon lengkapi data barang!");
      return;
    }

    // Jika data tidak berubah
    if (JSON.stringify(barang) === JSON.stringify(editBarang)) {
      setLoading(false);
      onCancel();
      return;
    }

    // jika foto bukan string, berarti foto adalah file
    if (typeof barang.foto !== "string") {
      const formFoto = new FormData();
      formFoto.append("image", barang.foto as Blob);

      // Kirim foto ke NEXT_PUBLIC_STORAGE
      axios
        .post(process.env.NEXT_PUBLIC_STORAGE ?? "", formFoto)
        .then((response: AxiosResponse<{ imageUrl: string }>) => {
          // Set barang.foto ke imageUrl
          const imageUrl = response.data.imageUrl;
          barang.foto = imageUrl;
          submitDataBarang(barang);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          toast.error("Gambar tidak tersimpan!");
        });
    } else {
      // Jika foto adalah string, berarti foto langsung dikirim ke API
      submitDataBarang(barang);
      setLoading(false);
    }
  };

  const submitDataBarang = (dataBarang: Barang) => {
    axios
      .post("/api/barang/create", dataBarang)
      .then(() => {
        editBarang
          ? toast.success("Data berhasil diubah!")
          : toast.success("Data berhasil disimpan!");
        onCancel();
      })
      .catch(() => {
        editBarang
          ? toast.error("Data gagal diubah!")
          : toast.error("Data gagal disimpan!");
      });
  };

  return (
    <div className="min-w-[92%] rounded-lg bg-white p-4 shadow-md sm:min-w-fit">
      <MediaUploader
        onMediaChange={handleFotoChange}
        imagePreview={imagePreview}
      />
      {/* inputs */}
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
      {/* Tombol Cancel dan Submit */}
      <div className="mt-4 flex justify-between gap-4 sm:justify-end">
        <button
          onClick={handleCancel}
          className="w-full rounded-md bg-gray-400 px-4 py-2 text-white sm:w-fit"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`w-full rounded-md px-4 py-2 text-white ${
            loading ? "cursor-not-allowed bg-gray-500" : "bg-blue-500"
          } sm:w-fit`}
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default InputBarang;

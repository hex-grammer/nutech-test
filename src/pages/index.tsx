import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { mutate } from "swr";
import BarangList from "~/components/BarangList";
import InputBarang from "~/components/InputBarang";
import type { Barang } from "~/utils/types";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as Barang[]);

export default function Home() {
  const [isTambahData, setIsTambahData] = useState(false);
  const { data: barangList } = useSWR<Barang[]>("/api/barang/get-all", fetcher);

  const handleCancle = async () => {
    await mutate("/api/barang/get-all");
    setIsTambahData(false);
  };

  const handleTambahDataClick = () => {
    setIsTambahData(true);
  };

  return (
    <>
      {isTambahData && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
          <InputBarang onCancel={() => void handleCancle()} />
        </div>
      )}
      <main className="flex min-h-screen flex-col bg-gray-200 p-4 font-mono sm:px-[15%]">
        <div className="flex items-end justify-between">
          <h1 className="text-center text-3xl font-bold text-blue-900">
            NuTech Data Barang
          </h1>
          {/* Tombol "Tambah Data" */}
          <button
            className="mt-4 self-end rounded-md bg-blue-600 px-4 py-2 text-white"
            onClick={handleTambahDataClick}
          >
            Tambah Data
          </button>
        </div>
        {!barangList ? (
          <p>Loading...</p>
        ) : (
          <BarangList barangList={barangList} />
        )}
      </main>
      <ToastContainer position="top-right" />
    </>
  );
}

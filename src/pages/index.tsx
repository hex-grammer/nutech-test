import axios from "axios";
import { useEffect, useState } from "react";
import BarangList from "~/components/BarangList";
import InputBarang from "~/components/InputBarang";
import type { Barang } from "~/utils/types";

const initialBarang: Barang = {
  id: 1,
  foto: "",
  nama: "",
  harga_beli: 0,
  harga_jual: 0,
  stok: 0,
};

export default function Home() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [isTambahData, setIsTambahData] = useState(false);

  const handleSubmit = (submittedBarang: Barang) => {
    console.log(submittedBarang);
    // Here you can perform the API call to save the submitted data to the backend
    // For example, you can use Axios to post the data to the server
    // axios.post("/api/barang", submittedBarang)
    //   .then((response) => {
    //     console.log("Data submitted successfully:", response.data);
    //     // Reset the form or any other necessary actions
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting data:", error);
    //   });
  };

  const handleCancle = () => {
    setIsTambahData(false);
  };

  useEffect(() => {
    // Fetch data from the API endpoint using Axios
    axios
      .get<Barang[]>("/api/barang/get-all")
      .then((response) => {
        setBarangList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleTambahDataClick = () => {
    setIsTambahData(true);
  };

  return (
    <>
      {isTambahData && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
          <InputBarang
            barang={initialBarang}
            onSubmit={handleSubmit}
            onCancel={handleCancle}
          />
        </div>
      )}
      <main className="flex min-h-screen flex-col bg-gray-100 p-4 sm:px-[15%]">
        <h1 className="text-center text-3xl font-bold text-blue-800">
          NuTech Data Barang
        </h1>
        {/* Tombol "Tambah Data" */}
        <button
          className="mt-4 self-end rounded-md bg-blue-600 px-4 py-2 text-white"
          onClick={handleTambahDataClick}
        >
          Tambah Data
        </button>
        <BarangList barangList={barangList} />
      </main>
    </>
  );
}

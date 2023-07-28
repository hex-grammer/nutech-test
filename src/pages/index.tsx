import axios from "axios";
import { useEffect, useState } from "react";
import BarangList from "~/components/BarangList";
import { ApiResponse, Barang } from "~/utils/types";

export default function Home() {
  const [barangList, setBarangList] = useState<Barang[]>([]);

  useEffect(() => {
    // Fetch data from the API endpoint using Axios
    axios
      .get<Barang[]>("/api/barang/get-all")
      .then((response) => {
        setBarangList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gray-100 sm:p-8">
        <h1 className="text-center text-3xl font-bold text-blue-800">
          NuTech Practical Test
        </h1>
        <BarangList barangList={barangList} />
      </main>
    </>
  );
}

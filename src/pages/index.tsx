import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import BarangList from "~/components/BarangList";
import InputBarang from "~/components/InputBarang";
import type { Barang } from "~/utils/types";
import Pagination from "~/components/Pagination";
import SearchInput from "~/components/SearchInput";
import { FiSearch } from "react-icons/fi";

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => res.data as { barangList: Barang[]; total: number });

export default function Home() {
  const [isTambahData, setIsTambahData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchText, setSearchText] = useState("");
  const [barangList, setBarangList] = useState<Barang[]>([]);

  // Fetch the data with the updated currentPage and pageSize
  const { data } = useSWR<{ barangList: Barang[]; total: number }>(
    `/api/barang/pagination?page=${currentPage}&pageSize=${pageSize}`,
    fetcher
  );

  // Update the barangList state whenever the data changes
  useEffect(() => {
    if (data?.barangList) {
      setBarangList(data.barangList);
    }
  }, [data]);

  const [editId, setEditId] = useState(0);

  const handleCancle = async () => {
    await mutate(
      `/api/barang/pagination?page=${currentPage}&pageSize=${pageSize}`
    );
    setIsTambahData(false);
    setEditId(0);
  };

  const handleTambahDataClick = () => {
    setIsTambahData(true);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      // Make a POST request to the search endpoint
      const response: AxiosResponse<Barang[]> = await axios.get(
        `/api/barang/search${searchText ? `?s=${searchText}` : ""}`
      );

      // Handle the response data
      const searchResults = response.data;

      if (searchResults.length === 0) {
        return toast.error("Data tidak ditemukan!");
      }

      // update the barangList state
      setBarangList(searchResults);
    } catch (error) {
      toast.error("Data tidak ditemukan!");
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setBarangList(data?.barangList ?? []);
    }
  };

  return (
    <>
      {/* FORM MODAL */}
      {(editId || isTambahData) && (
        <div className="fixed z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
          {editId > 0 ? (
            <InputBarang
              editBarang={
                barangList.filter((barang) => barang.id === editId)[0]
              }
              onCancel={() => void handleCancle()}
            />
          ) : (
            <InputBarang onCancel={() => void handleCancle()} />
          )}
        </div>
      )}
      <main className="flex min-h-screen flex-col bg-gray-200 p-4 font-mono sm:px-[15%]">
        <div className="flex flex-col items-end justify-between sm:flex-row">
          <h1 className="w-full text-center text-3xl font-bold text-blue-900 sm:w-fit">
            NuTech Data Barang
          </h1>
        </div>
        <div className="mt-4 flex flex-col items-center justify-between sm:flex-row">
          <button
            className="mb-4 w-fit rounded-md bg-blue-600 px-4 py-2 text-white sm:mb-0"
            onClick={handleTambahDataClick}
          >
            Tambah Data
          </button>
          <div className="flex items-center gap-2">
            <Pagination
              currentPage={currentPage}
              totalItems={data?.total ?? 0}
              pageSize={pageSize}
              onChangePage={handleChangePage}
            />
            <SearchInput
              value={searchText}
              onChange={onSearchChange}
              onSearch={() => void handleSearch()}
            />
          </div>
        </div>
        {barangList.length < 0 ? (
          <p>Loading...</p>
        ) : (
          <BarangList
            mutate={() =>
              void mutate(
                `/api/barang/pagination?page=${currentPage}&pageSize=${pageSize}`
              )
            }
            setEditId={setEditId}
            barangList={barangList}
          />
        )}
      </main>
      <ToastContainer position="top-right" />
    </>
  );
}

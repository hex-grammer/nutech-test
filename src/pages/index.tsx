import axios from "axios";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { mutate } from "swr";
import BarangList from "~/components/BarangList";
import InputBarang from "~/components/InputBarang";
import type { Barang } from "~/utils/types";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => res.data as { barangList: Barang[]; total: number });

export default function Home() {
  const [isTambahData, setIsTambahData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Fetch the data with the updated currentPage and pageSize
  const { data } = useSWR<{ barangList: Barang[]; total: number }>(
    `/api/barang/pagination?page=${currentPage}&pageSize=${pageSize}`,
    fetcher
  );

  const [editId, setEditId] = useState(0);

  const handleCancle = async () => {
    await mutate("/api/barang/get-all");
    setIsTambahData(false);
    setEditId(0);
  };

  const handleTambahDataClick = () => {
    setIsTambahData(true);
  };

  return (
    <>
      {/* FORM MODAL */}
      {(editId || isTambahData) && (
        <div className="fixed z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
          {editId > 0 ? (
            <InputBarang
              editBarang={
                data?.barangList?.filter((barang) => barang.id === editId)[0]
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
          {/* Tombol "Tambah Data" */}
          <button
            className="mt-4 w-fit rounded-md bg-blue-600 px-4 py-2 text-white"
            onClick={handleTambahDataClick}
          >
            Tambah Data
          </button>
        </div>
        {/* Pagination buttons */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className={`rounded-md px-2 py-1`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <BiChevronLeft />
          </button>
          {/* Display current page and total pages */}
          {data?.total && (
            <div className="flex items-center gap-2">
              {[...Array<number>(Math.ceil(data.total / pageSize))].map(
                (_, index) => (
                  <>
                    {currentPage === index + 1 ? (
                      <div
                        key={index}
                        className="cursor-pointer rounded-md bg-gray-300 px-2 text-center text-gray-600"
                        onClick={() => void setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="cursor-pointer rounded-md px-2 text-center text-gray-600"
                        onClick={() => void setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          )}
          <button
            className={`rounded-md px-2 py-1`}
            onClick={handleNextPage}
            disabled={!data?.barangList || data.barangList.length < pageSize}
          >
            <BiChevronRight />
          </button>
        </div>
        {!data?.barangList ? (
          <p>Loading...</p>
        ) : (
          <BarangList
            mutate={() => void mutate("/api/barang/get-all")}
            setEditId={setEditId}
            barangList={data?.barangList}
          />
        )}
      </main>
      <ToastContainer position="top-right" />
    </>
  );
}

import React from "react";
import BarangCard from "./BarangCard";
import type { Barang } from "~/utils/types";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  barangList: Barang[];
  mutate: () => void;
  setEditId: React.Dispatch<React.SetStateAction<number>>;
}

const BarangList: React.FC<Props> = ({ barangList, setEditId, mutate }) => {
  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Anda ingin menghapus barang ini?")) {
      return;
    }
    try {
      await axios.delete(`/api/barang/delete`, { data: { id } });
      mutate();
      toast.warn("Barang telah dihapus.");
    } catch (error) {
      toast.error("Barang gagal dihapus.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
      {barangList.map((barang) => (
        <BarangCard
          key={barang.id}
          barang={barang}
          onEdit={() => handleEdit(barang.id)}
          onDelete={() => void handleDelete(barang.id)}
        />
      ))}
    </div>
  );
};

export default BarangList;

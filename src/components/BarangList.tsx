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
    // Implement your edit logic here
    setEditId(id);
  };

  const handleDelete = async (id: number) => {
    // Show a confirmation dialog before proceeding with deletion
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this barang?"
    );
    if (!shouldDelete) {
      return; // If the user cancels, exit the function without proceeding with deletion
    }

    try {
      // Send the DELETE request to the API endpoint to remove the barang
      await axios.delete(`/api/barang/delete`, { data: { id } });

      // Call the mutate function to update the data in the cache
      mutate();

      // Handle successful deletion
      toast.warn("Barang telah dihapus.");
    } catch (error) {
      // Handle error if the deletion fails
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

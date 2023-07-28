import React from "react";
import BarangCard from "./BarangCard";
import type { Barang } from "~/utils/types";

interface Props {
  barangList: Barang[];
}

const BarangList: React.FC<Props> = ({ barangList }) => {
  const handleEdit = (id: number) => {
    // Implement your edit logic here
    console.log("Editing barang with ID:", id);
  };

  const handleDelete = (id: number) => {
    // Implement your remove logic here
    console.log("Removing barang with ID:", id);
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      {barangList.map((barang) => (
        <BarangCard
          key={barang.id}
          barang={barang}
          onEdit={() => handleEdit(barang.id)}
          onDelete={() => handleDelete(barang.id)}
        />
      ))}
    </div>
  );
};

export default BarangList;

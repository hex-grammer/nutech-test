import React from "react";
import Image from "next/image";
import type { Barang } from "~/utils/types";

interface Props {
  barang: Barang;
  onEdit: () => void;
  onDelete: () => void;
}

const BarangCard: React.FC<Props> = ({ barang, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
        <Image
          src={barang.foto}
          alt={barang.nama}
          layout="fill"
          objectFit="cover"
          className="object-center"
        />
      </div>
      <div className="p-4">
        <div className="text-xl font-bold">{barang.nama}</div>
        <p>Harga Beli: {barang.harga_beli}</p>
        <p>Harga Jual: {barang.harga_jual}</p>
        <p>Stok: {barang.stok}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onDelete}
            className="rounded-md bg-red-500 px-4 py-2 text-white"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarangCard;

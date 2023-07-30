import React from "react";
import Image from "next/image";
import type { Barang } from "~/utils/types";
import { formatMoney } from "~/utils/formatMoney";

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
          src={
            typeof barang.foto === "string"
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${barang.foto}`
              : ""
          }
          alt={barang.nama}
          layout="fill"
          objectFit="cover"
          className="object-center"
        />
      </div>
      <div className="p-4 pt-2">
        <div className="text-xl font-bold">{barang.nama}</div>
        <p>Beli :{formatMoney(barang.harga_beli)}</p>
        <p>Jual :{formatMoney(barang.harga_jual)}</p>
        <p>Stok :{barang.stok}</p>
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

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { type Barang } from "~/utils/types";

interface BarangContextValue {
  barang: Barang;
  setBarang: React.Dispatch<React.SetStateAction<Barang>>;
  clearBarang: () => void;
}

const BarangContext = createContext<BarangContextValue | undefined>(undefined);

interface BarangProviderProps {
  children: ReactNode;
}

const BarangProvider: React.FC<BarangProviderProps> = ({ children }) => {
  const [barang, setBarang] = useState<Barang>({
    id: 0,
    foto: "",
    nama: "",
    harga_beli: 0,
    harga_jual: 0,
    stok: 0,
  });

  const clearBarang = () => {
    setBarang({
      id: 0,
      foto: "",
      nama: "",
      harga_beli: 0,
      harga_jual: 0,
      stok: 0,
    });
  };

  return (
    <BarangContext.Provider value={{ barang, setBarang, clearBarang }}>
      {children}
    </BarangContext.Provider>
  );
};

const useBarangContext = () => {
  const context = useContext(BarangContext);
  if (!context) {
    throw new Error("useBarangContext must be used within a BarangProvider");
  }
  return context;
};

export { BarangProvider, useBarangContext };

export interface Barang {
  id: number;
  foto: string;
  nama: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
}

export interface Data {
  data: Barang[];
}
export interface ApiResponse {
  data: Data[];
}

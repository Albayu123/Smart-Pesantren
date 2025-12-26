export interface Santri {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  wali: string;
  alamat: string;
  status: 'Aktif' | 'Alumni' | 'Cuti';
  tanggalMasuk: string;
}

export interface Donatur {
  id: string;
  nama: string;
  jumlahBeras: number; // in Kg
  tanggal: string;
  noHp: string;
  catatan: string;
}

// Mengganti enum dengan const object agar kompatibel dengan 'erasableSyntaxOnly'
export const AppView = {
  DASHBOARD: 'DASHBOARD',
  SANTRI: 'SANTRI',
  DONATUR: 'DONATUR',
} as const;

export type AppView = typeof AppView[keyof typeof AppView];

export interface Stats {
  totalSantri: number;
  totalDonatur: number;
  totalBeras: number;
}

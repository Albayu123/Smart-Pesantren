import type { Santri, Donatur } from '../types';

const SANTRI_KEY = 'smpt_santri_data';
const DONATUR_KEY = 'smpt_donatur_data';

const initialSantri: Santri[] = [
  { id: '1', nama: 'Ahmad Fulan', nis: '2023001', kelas: '1 Ulya', wali: 'Budi Santoso', alamat: 'Jl. Merdeka No. 1, Jakarta', status: 'Aktif', tanggalMasuk: '2023-07-15' },
  { id: '2', nama: 'Siti Aminah', nis: '2023002', kelas: '1 Wustho', wali: 'Hasan Basri', alamat: 'Jl. Sudirman No. 45, Bandung', status: 'Aktif', tanggalMasuk: '2023-07-16' },
  { id: '3', nama: 'Rudi Hartono', nis: '2022055', kelas: '2 Ulya', wali: 'Dedi Mulyadi', alamat: 'Jl. Ahmad Yani, Surabaya', status: 'Cuti', tanggalMasuk: '2022-07-10' },
];

const initialDonatur: Donatur[] = [
  { id: '1', nama: 'Hamba Allah', jumlahBeras: 50, tanggal: '2023-10-01', noHp: '081234567890', catatan: 'Semoga berkah' },
  { id: '2', nama: 'CV. Berkah Abadi', jumlahBeras: 200, tanggal: '2023-10-05', noHp: '081987654321', catatan: 'Zakat Mal Perusahaan' },
  { id: '3', nama: 'Ibu Ratna', jumlahBeras: 25, tanggal: '2023-10-10', noHp: '085678901234', catatan: 'Sedekah Jumat' },
];

export const getSantriData = (): Santri[] => {
  const data = localStorage.getItem(SANTRI_KEY);
  if (!data) {
    localStorage.setItem(SANTRI_KEY, JSON.stringify(initialSantri));
    return initialSantri;
  }
  return JSON.parse(data);
};

export const saveSantriData = (data: Santri[]) => {
  localStorage.setItem(SANTRI_KEY, JSON.stringify(data));
};

export const getDonaturData = (): Donatur[] => {
  const data = localStorage.getItem(DONATUR_KEY);
  if (!data) {
    localStorage.setItem(DONATUR_KEY, JSON.stringify(initialDonatur));
    return initialDonatur;
  }
  return JSON.parse(data);
};

export const saveDonaturData = (data: Donatur[]) => {
  localStorage.setItem(DONATUR_KEY, JSON.stringify(data));
};

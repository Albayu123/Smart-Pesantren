import React, { useState } from 'react';
import type { Donatur } from '../types';
import { Plus, Trash2, Edit2, Search, Heart, Mail, Loader2, X, Sparkles } from 'lucide-react';
import { generateThankYouLetter } from '../services/gemini';

interface DonaturManagerProps {
  data: Donatur[];
  onUpdate: (data: Donatur[]) => void;
}

const DonaturManager: React.FC<DonaturManagerProps> = ({ data, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [letterModal, setLetterModal] = useState<{open: boolean, content: string, loading: boolean}>({ open: false, content: '', loading: false });
  
  const [formData, setFormData] = useState<Partial<Donatur>>({
    nama: '', jumlahBeras: 0, noHp: '', catatan: '', tanggal: new Date().toISOString().split('T')[0]
  });

  const filteredData = data.filter(d => 
    d.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = data.map(d => d.id === editingId ? { ...d, ...formData } as Donatur : d);
      onUpdate(updated);
    } else {
      const donaturData = formData as Omit<Donatur, 'id'>;
      const newDonatur: Donatur = {
        ...donaturData,
        id: Date.now().toString(),
      };
      onUpdate([...data, newDonatur]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus data donatur ini?')) {
      onUpdate(data.filter(d => d.id !== id));
    }
  };

  const openEdit = (donatur: Donatur) => {
    setFormData(donatur);
    setEditingId(donatur.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData({ nama: '', jumlahBeras: 0, noHp: '', catatan: '', tanggal: new Date().toISOString().split('T')[0] });
    setIsModalOpen(false);
  };

  const handleGenerateLetter = async (donatur: Donatur) => {
    setLetterModal({ open: true, content: '', loading: true });
    const letter = await generateThankYouLetter(donatur.nama, donatur.jumlahBeras);
    setLetterModal({ open: true, content: letter, loading: false });
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Donasi Beras</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Donasi
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama donatur..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Donatur</th>
                <th className="px-6 py-4">Jumlah (Kg)</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Catatan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(donatur => (
                <tr key={donatur.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                    <Heart size={16} className="text-red-500 flex-shrink-0" /> {donatur.nama}
                  </td>
                  <td className="px-6 py-4 font-bold text-pesantren-700">{donatur.jumlahBeras} Kg</td>
                  <td className="px-6 py-4 text-gray-600">{donatur.tanggal}</td>
                  <td className="px-6 py-4 text-gray-600">{donatur.noHp}</td>
                  <td className="px-6 py-4 text-gray-500 italic text-sm truncate max-w-xs">{donatur.catatan}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                     <button 
                      onClick={() => handleGenerateLetter(donatur)} 
                      className="text-pesantren-600 hover:text-pesantren-800 p-1 border border-pesantren-200 rounded hover:bg-pesantren-50"
                      title="Buat Surat Ucapan"
                    >
                      <Mail size={18} />
                    </button>
                    <button onClick={() => openEdit(donatur)} className="text-blue-600 hover:text-blue-800 p-1">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(donatur.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
               {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada data donasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Donatur' : 'Catat Donasi Baru'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Donatur</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none" 
                  value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Beras (Kg)</label>
                  <input required type="number" min="0" step="0.5" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none" 
                    value={formData.jumlahBeras} onChange={e => setFormData({...formData, jumlahBeras: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input required type="date" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none" 
                    value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone</label>
                <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none" 
                  value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Doa</label>
                <textarea className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none" 
                  value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} rows={2} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {letterModal.open && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="bg-pesantren-600 p-4 text-white flex justify-between items-center flex-shrink-0">
               <h3 className="font-bold flex items-center gap-2 text-sm md:text-base"><Sparkles size={18} className="text-yellow-300"/> Asisten Surat (AI)</h3>
               <button onClick={() => setLetterModal({ ...letterModal, open: false })}><X size={20} /></button>
             </div>
             <div className="p-4 md:p-6 overflow-y-auto">
                {letterModal.loading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <Loader2 className="animate-spin text-pesantren-600" size={40} />
                    <p className="text-gray-500 text-center text-sm">Sedang menyusun kata-kata mutiara...</p>
                  </div>
                ) : (
                  <div className="prose max-w-none text-gray-800 whitespace-pre-wrap font-serif bg-yellow-50 p-4 md:p-6 rounded-lg border border-yellow-200 text-sm md:text-base">
                    {letterModal.content}
                  </div>
                )}
             </div>
             <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 flex-shrink-0">
                <button onClick={() => setLetterModal({...letterModal, open: false})} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Tutup</button>
                {!letterModal.loading && (
                  <button onClick={() => navigator.clipboard.writeText(letterModal.content)} className="px-4 py-2 bg-pesantren-600 text-white rounded-lg hover:bg-pesantren-700 text-sm">
                    Salin Teks
                  </button>
                )}
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default DonaturManager;
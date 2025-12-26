import React, { useState } from 'react';
import type { Santri } from '../types';
import { Plus, Trash2, Edit2, Search, User } from 'lucide-react';

interface SantriManagerProps {
  data: Santri[];
  onUpdate: (data: Santri[]) => void;
}

const SantriManager: React.FC<SantriManagerProps> = ({ data, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Santri>>({
    nama: '', nis: '', kelas: '', wali: '', alamat: '', status: 'Aktif'
  });

  const filteredData = data.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Edit
      const updated = data.map(s => s.id === editingId ? { ...s, ...formData } as Santri : s);
      onUpdate(updated);
    } else {
      const santriData = formData as Omit<Santri, 'id'>;
      const newSantri: Santri = {
        ...santriData,
        id: Date.now().toString(),
        tanggalMasuk: new Date().toISOString().split('T')[0],
      };
      onUpdate([...data, newSantri]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus data santri ini?')) {
      onUpdate(data.filter(s => s.id !== id));
    }
  };

  const openEdit = (santri: Santri) => {
    setFormData(santri);
    setEditingId(santri.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData({ nama: '', nis: '', kelas: '', wali: '', alamat: '', status: 'Aktif' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Santri</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-pesantren-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-pesantren-700 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Santri
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau NIS..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pesantren-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Santri</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Wali</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(santri => (
                <tr key={santri.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pesantren-100 rounded-full flex items-center justify-center text-pesantren-600 flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{santri.nama}</p>
                        <p className="text-xs text-gray-500">NIS: {santri.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{santri.kelas}</td>
                  <td className="px-6 py-4 text-gray-700">{santri.wali}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      santri.status === 'Aktif' ? 'bg-green-100 text-green-700' :
                      santri.status === 'Cuti' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {santri.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(santri)} className="text-blue-600 hover:text-blue-800 p-1">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(santri.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Santri' : 'Tambah Santri Baru'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none" 
                  value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                  <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none" 
                    value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none" 
                    value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wali</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none" 
                  value={formData.wali} onChange={e => setFormData({...formData, wali: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none" 
                  value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-pesantren-500 focus:outline-none"
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-pesantren-600 text-white rounded-lg hover:bg-pesantren-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SantriManager;
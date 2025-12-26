import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Stats } from '../types';
import { generatePesantrenInsight } from '../services/gemini';
import { Users, Package, Heart, Sparkles, Loader2 } from 'lucide-react';

interface DashboardProps {
  stats: Stats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const data = [
    { name: 'Santri', value: stats.totalSantri, color: '#22c55e' },
    { name: 'Donatur', value: stats.totalDonatur, color: '#eab308' },
    { name: 'Beras (Kuital)', value: stats.totalBeras / 100, color: '#3b82f6' }, // Convert Kg to Quintal for scale
  ];

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const text = await generatePesantrenInsight(stats.totalSantri, stats.totalDonatur, stats.totalBeras);
    setInsight(text);
    setLoadingInsight(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Eksekutif</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-pesantren-100 text-pesantren-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Santri</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSantri}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Beras Terkumpul</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalBeras} <span className="text-sm font-normal text-gray-500">Kg</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Donatur Aktif</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalDonatur}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Statistik Ringkas</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pesantren-50 to-white p-6 rounded-xl shadow-sm border border-pesantren-200 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-pesantren-800 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" />
              Saran Pengembangan (AI)
            </h3>
            <button 
              onClick={handleGenerateInsight}
              disabled={loadingInsight}
              className="px-4 py-2 bg-pesantren-600 text-white rounded-lg text-sm hover:bg-pesantren-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loadingInsight ? <Loader2 className="animate-spin" size={16} /> : 'Analisa Data'}
            </button>
          </div>
          
          <div className="bg-white/60 p-4 rounded-lg h-64 overflow-y-auto text-sm text-gray-700 leading-relaxed border border-pesantren-100">
            {insight ? (
              <div className="markdown-body whitespace-pre-wrap">{insight}</div>
            ) : (
              <p className="text-gray-400 italic text-center mt-20">
                Klik tombol "Analisa Data" untuk mendapatkan masukan strategis berbasis AI mengenai pengelolaan pesantren Anda.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

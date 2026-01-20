import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Stats } from '../types';

import { Users, Package, Heart } from 'lucide-react';

interface DashboardProps {
  stats: Stats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const data = [
    { name: 'Santri', value: stats.totalSantri, color: '#22c55e' },
    { name: 'Donatur', value: stats.totalDonatur, color: '#eab308' },
    { name: 'Beras (Kuital)', value: stats.totalBeras / 100, color: '#3b82f6' }, // Convert Kg to Quintal for scale
  ];

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

      <div className="grid grid-cols-1 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard;

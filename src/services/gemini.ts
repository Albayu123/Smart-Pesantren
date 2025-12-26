import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
  }

  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
  }

  return '';
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateThankYouLetter = async (donaturName: string, amount: number): Promise<string> => {
  if (!ai) return "API Key belum dikonfigurasi. Pastikan Anda memiliki file .env dengan VITE_API_KEY (di VS Code) atau API_KEY (di Preview).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan surat ucapan terima kasih resmi namun hangat dan islami dari pengurus pesantren untuk donatur bernama ${donaturName} yang telah menyumbangkan beras seberat ${amount} Kg. Sertakan doa untuk keberkahan harta donatur. Gunakan bahasa Indonesia yang baik.`,
    });
    return response.text || "Gagal menghasilkan teks.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Pastikan API Key valid.";
  }
};

export const generatePesantrenInsight = async (santriCount: number, donaturCount: number, totalRice: number): Promise<string> => {
  if (!ai) return "API Key belum dikonfigurasi.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sebagai konsultan manajemen pesantren, berikan 3 saran singkat dan strategis untuk pengembangan pesantren dengan data saat ini: ${santriCount} santri, ${donaturCount} donatur aktif, dan stok beras donasi terkumpul ${totalRice} Kg. Fokus pada kemandirian pangan dan pendidikan.`,
    });
    return response.text || "Gagal menghasilkan analisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI.";
  }
};

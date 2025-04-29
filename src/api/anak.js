// src/api/anak.js
import { fetchWithAuth, createFormData } from './utils';

export const anakApi = {
  /**
   * Mendapatkan daftar anak
   * @param {Object} params - Parameter pencarian dan filter
   * @param {number} [params.page=1] - Halaman yang akan ditampilkan
   * @param {string} [params.search=''] - Kata kunci pencarian
   * @param {string} [params.status=''] - Filter status anak
   * @param {number} [params.per_page=10] - Jumlah item per halaman
   * @returns {Promise} Daftar anak
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      status = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(status && { status }),
    });

    return fetchWithAuth(`/anak?${queryParams}`);
  },

  /**
   * Mendapatkan detail anak berdasarkan ID
   * @param {number|string} id - ID anak
   * @returns {Promise} Detail anak
   */
  getById: async (id) => {
    return fetchWithAuth(`/anak/${id}`);
  },

  /**
   * Membuat data anak baru
   * @param {Object} dataAnak - Data anak yang akan dibuat
   * @returns {Promise} Respon pembuatan anak
   */
  create: async (dataAnak) => {
    // Cek apakah ada file foto yang akan diupload
    const isFileUpload = dataAnak.foto && typeof dataAnak.foto !== 'string';
    
    // Jika ada file foto, gunakan FormData
    if (isFileUpload) {
      const formData = createFormData(dataAnak);
      return fetchWithAuth('/anak/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } 
    // Jika tidak ada foto, kirim sebagai JSON
    else {
      return fetchWithAuth('/anak/create', {
        method: 'POST',
        body: JSON.stringify(dataAnak),
      });
    }
  },

  /**
   * Memperbarui data anak
   * @param {number|string} id - ID anak yang akan diperbarui
   * @param {Object} dataAnak - Data anak yang akan diupdate
   * @returns {Promise} Respon update anak
   */
  update: async (id, dataAnak) => {
    // Cek apakah ada file foto yang akan diupload
    const isFileUpload = dataAnak.foto && typeof dataAnak.foto !== 'string';
    
    // Jika ada file foto, gunakan FormData
    if (isFileUpload) {
      const formData = createFormData(dataAnak);
      return fetchWithAuth(`/anak/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } 
    // Jika tidak ada foto, kirim sebagai JSON
    else {
      return fetchWithAuth(`/anak/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(dataAnak),
      });
    }
  },

  /**
   * Menghapus data anak
   * @param {number|string} id - ID anak yang akan dihapus
   * @returns {Promise} Respon penghapusan anak
   */
  delete: async (id) => {
    return fetchWithAuth(`/anak/delete/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Mengupload foto anak
   * @param {number|string} id - ID anak
   * @param {File} foto - File foto yang akan diupload
   * @returns {Promise} Respon upload foto
   */
  uploadFoto: async (id, foto) => {
    const formData = new FormData();
    formData.append('foto', foto);

    return fetchWithAuth(`/anak/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },

  /**
   * Mengambil foto anak
   * @param {number|string} id - ID anak
   * @returns {Promise} URL atau data foto anak
   */
  getFoto: async (id) => {
    return fetchWithAuth(`/anak/${id}/foto`);
  },
};
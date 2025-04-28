// src/utils/dateUtils.js

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  /**
   * Format tanggal dari "DD-MM-YYYY" menjadi "DD Month YYYY"
   * @param {string} dateString - Tanggal dalam format "DD-MM-YYYY"
   * @returns {string} Tanggal dalam format "DD Month YYYY"
   */
  export const formatBirthDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const [day, month, year] = dateString.split('-');
      const monthName = MONTHS[parseInt(month, 10) - 1];
      return `${day} ${monthName} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if parsing fails
    }
  };
  
  /**
   * Hitung usia dari tanggal lahir
   * @param {string} birthDateString - Tanggal lahir dalam format "DD-MM-YYYY"
   * @returns {number} Usia dalam tahun
   */
  export const calculateAge = (birthDateString) => {
    if (!birthDateString) return 0;
    
    try {
      const [day, month, year] = birthDateString.split('-');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  };
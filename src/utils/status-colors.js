// src/utils/status-colors.js
export const getStatusCpbColor = (status) => {
    switch (status) {
      case 'BCPB':
        return {
          backgroundColor: '#E6F2FF', // Light blue
          textColor: '#2E86DE',
          label: 'BCPB'
        };
      case 'NPB':
        return {
          backgroundColor: '#FFF0E6', // Light orange
          textColor: '#FF6B00',
          label: 'NPB'
        };
      case 'CPB':
        return {
          backgroundColor: '#E6F7F0', // Light green
          textColor: '#2ECC71',
          label: 'CPB'
        };
      case 'PB':
        return {
          backgroundColor: '#F0E6FF', // Light purple
          textColor: '#9B51E0',
          label: 'PB'
        };
      default:
        return {
          backgroundColor: '#F0F0F0', // Light gray
          textColor: '#666',
          label: 'Tidak Diketahui'
        };
    }
  };
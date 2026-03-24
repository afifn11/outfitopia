export const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

export const formatDate = (date, options = {}) =>
    new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', ...options
    });

export const truncate = (str, len = 50) =>
    str && str.length > len ? str.substring(0, len) + '...' : str || '';

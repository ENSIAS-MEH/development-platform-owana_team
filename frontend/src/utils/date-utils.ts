export const formatDate = (dateInput: any): string => {
  if (!dateInput) return '-';
  
  try {
    if (Array.isArray(dateInput) && dateInput.length >= 3) {
      const [year, month, day] = dateInput;
      const date = new Date(year, month - 1, day); 
      return date.toLocaleDateString('fr-FR');
    }
    
    const date = new Date(dateInput);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};
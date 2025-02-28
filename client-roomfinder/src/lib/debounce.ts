export function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
  
    const debouncedFunction = function(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  
    debouncedFunction.cancel = () => {
      clearTimeout(timeout);
    };
  
    return debouncedFunction as typeof debouncedFunction & { cancel: () => void };
  }
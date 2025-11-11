// Debug utility for authentication state
export const debugAuth = () => {
  const token = localStorage.getItem('token');
  
  console.log('=== AUTH DEBUG ===');
  console.log('Token exists:', !!token);
  
  if (token) {
    console.log('Token length:', token.length);
    
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp <= currentTime;
        
        console.log('Token structure: Valid JWT');
        console.log('User:', payload.user?.email || 'Unknown');
        console.log('Issued:', new Date(payload.iat * 1000).toLocaleString());
        console.log('Expires:', new Date(payload.exp * 1000).toLocaleString());
        console.log('Is Expired:', isExpired);
        console.log('Time left:', Math.round((payload.exp - currentTime) / 60), 'minutes');
      } else {
        console.log('Token structure: Invalid JWT format');
      }
    } catch (error) {
      console.log('Token parsing error:', error);
    }
  }
  
  console.log('================');
};

// Add to window for easy access in browser console
declare global {
  interface Window {
    debugAuth: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
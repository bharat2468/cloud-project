// Authentication utility functions

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("productID");
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (with 1 minute buffer)
    return payload.exp > (currentTime + 60);
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const handleAuthError = (response: Response): boolean => {
  if (response.status === 401) {
    console.log("Authentication failed, clearing token and redirecting");
    removeAuthToken();
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
    return true;
  }
  return false;
};

export const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  if (!isTokenValid(token)) {
    removeAuthToken();
    throw new Error("Token expired");
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });
};
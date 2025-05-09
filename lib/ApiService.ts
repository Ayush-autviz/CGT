import useAuthStore from '@/stores/authStore';
import axios from 'axios';

//export const BASE_URL = "http://18.216.181.203:5000/";

export const BASE_URL = "http://18.216.181.203:5000/";



// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Utility function to handle navigation in non-component context
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'; // Client-side redirect
  }
};

// Add response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is 401 and the request is NOT for login/auth endpoints
    if (error.response?.status === 401 &&
        !error.config.url?.includes('api/auth/login') &&
        !error.config.url?.includes('api/auth/register')) {
      // Clear auth store using clearAuth
      useAuthStore.getState().clearAuth();
      // Redirect to login page
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to automatically add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signUpUser = async (credentials: { email: string; password: string; name: string }) => {
  try {
    const response = await api.post('api/auth/register', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendVerification = async (credentials: { email: string }) => {
  try {
    const response = await api.post('api/auth/resend-verification', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendPasswordVerification = async (credentials: { email: string }) => {
    try {
      const response = await api.post('api/auth/resend-password-reset', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  };



// Chat bot APIs
export const createSession = async (title: string) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token available');

    const response = await api.post('api/assistant/sessions', { title });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserName = async (name: string) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No token available');

      const response = await api.put('api/auth/profile', { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const getSessions = async () => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token available');

    const response = await api.get('api/assistant/sessions');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};





export const getSessionMessages = async (sessionId: number) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token available');

    const response = await api.get(`api/assistant/sessions/${sessionId}/messages`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createSessionMessage = async (
  sessionId: number,
  message: { content: string; file?: File }
) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token available');

    const formData = new FormData();
    if(message.content){
      formData.append('content', message.content);
    }
    // formData.append('content', message.content);
    if (message.file) {
      formData.append('file', message.file);
    }

    const response = await api.post(`api/assistant/sessions/${sessionId}/messages`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSession = async (sessionId: number) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token available');

    const response = await api.delete(`api/assistant/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordLink = async (email: string) => {
    try {
      const response = await api.post(`api/auth/reset-password`,{
        email: email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const resetPassword = async ({password,token}:{password: string,token: string}) => {
    try {
      const response = await api.post(`api/auth/reset-password/${token}`,{
        password: password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const changePassword = async ({oldPassword,newPassword}:{oldPassword: string,newPassword: string}) => {
    try {
      const response = await api.put(`api/auth/change-password`,{
        current_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const fetchCourses = async () => {
  try {
    const response = await api.get('api/courses');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};

export const fetchCourseLectures = async (courseId: string) => {
  try {
    const response = await api.get(`api/courses/${courseId}/videos`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lectures');
  }
};
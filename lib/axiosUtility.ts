import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const instance = axios.create({ 

  // baseURL: 'http://192.168.1.8:3000', 
  // baseURL: 'https://apis.offersholic.zephyrapps.in/',

    baseURL: 'https://backendoff.vercel.app/',
  //  baseURL : 'https://offersholic-server-v1.vercel.app/' 


});


export const fetchData = async (endpoint:any, config = {}) => {
  const token = await SecureStore.getItemAsync('session');
 
  try {
    const response = await instance.request({
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });
    

    return response?.data;
  } catch (error) {
    console.error('Axios request error:', error);
    throw error;
  }
};

export const postData = async (endpoint: any, data: any, config = {}) => {
    const token = await SecureStore.getItemAsync('session');

  try {
    const response = await instance.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error('Axios POST request error:', error);
    throw error;
  }
};


export const putData = async (endpoint: any, data?: any, config = {}) => {
    const token = await SecureStore.getItemAsync('session');

  try {
      const response = await instance.put(endpoint, data, {
          headers: {
              Authorization: `Bearer ${token}`,
              
            },
          ...config,
      });

      return response.data;
  } catch (error) {
      console.error('Axios PUT request error:', error);
      throw error;
  }
};

export const patchData = async (endpoint: any, data?: any, config = {}) => {
  const token = await SecureStore.getItemAsync('session');

try {
    const response = await instance.patch(endpoint, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            
          },
        ...config,
    });

    return response.data;
} catch (error) {
    console.error('Axios PUT request error:', error);
    throw error;
}
};

export const deleteData = async (endpoint: string, config = {}) => {
    const token = await SecureStore.getItemAsync('session');

  try {
    const response = await instance.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error('Axios delete request error:', error);
    throw error;
  }
};

export const deleteAllData = async (endpoint: string, data: any, config = {}) => {
    const token = await SecureStore.getItemAsync('session');

  try {
    const response = await instance.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
      data, // Assuming Axios expects the data to be passed in the 'data' property for DELETE requests
    });

    return response.data;
  } catch (error) {
    console.error('Axios delete request error:', error);
    throw {
      message: 'Error making delete request',
      originalError: error,
    };
  }
};



export const activateCoupon = async (endpoint: any, data: any, config = {}) => {
    const token = await SecureStore.getItemAsync('session');

    try {
      const response = await instance.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        ...config,
      });
  
      return response.data;
    } catch (error) {
      console.error('Axios put request error:', error);
      throw error;
    }
  };
  

export default instance;
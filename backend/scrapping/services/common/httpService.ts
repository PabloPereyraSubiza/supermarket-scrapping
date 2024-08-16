import axios, { AxiosRequestConfig } from 'axios';

const defaultConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
};

export const fetchHtml = async (url: string, config: AxiosRequestConfig = {}) => {
  try {
    const response = await axios.get(url, { ...defaultConfig, ...config });
    return response.data;
  } catch (error) {
    console.error(`Error fetching HTML from ${url}:`, error);
    throw error;
  }
};

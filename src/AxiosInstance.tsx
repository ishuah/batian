import axios from "axios";

const baseUrl = "http://localhost:8000/api/v1/";
const headers = {'Authorization': `ApiKey ${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_KEY}`};

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: headers
  });
  

export default AxiosInstance;
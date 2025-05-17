// setting up the axios default url
import axios from 'axios' // Import axios library

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // Set base URL for all requests
  withCredentials: true // Send cookies with requests
})

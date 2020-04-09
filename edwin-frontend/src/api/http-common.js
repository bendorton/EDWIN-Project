import axios from 'axios';

let baseIP = process.env.VUE_APP_BASE_URL;

export const HTTP = axios.create({
  baseURL: baseIP,
  headers: {
    //Authorization: 'Bearer {token}'
  }
})
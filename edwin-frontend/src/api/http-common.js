import axios from 'axios';

//let baseIP = process.env.VUE_APP_BASE_URL;
let baseIP = "http://69.162.231.249:3030"
export const HTTP = axios.create({
  baseURL: baseIP,
  headers: {
    //Authorization: 'Bearer {token}'
  }
})
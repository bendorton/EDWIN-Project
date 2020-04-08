import axios from 'axios';

let baseIP = process.env.BASE_URL;

export const HTTP = axios.create({
  baseURL: baseIP,
  //baseURL: `http://localhost:3030`,
  //baseURL: `https://edwin.free.beeceptor.com`,
  headers: {
    //Authorization: 'Bearer {token}'
  }
})
import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://localhost:8080/ `,
  baseURL: `https://edwin.free.beeceptor.com`,
  headers: {
    //Authorization: 'Bearer {token}'
  }
})
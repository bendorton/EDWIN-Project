import axios from 'axios';

export const HTTP = axios.create({
  baseURL: 'http://69.162.231.249:3030',
  //baseURL: `http://localhost:3030`,
  //baseURL: `https://edwin.free.beeceptor.com`,
  headers: {
    //Authorization: 'Bearer {token}'
  }
})
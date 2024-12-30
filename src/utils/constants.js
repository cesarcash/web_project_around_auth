import { getToken } from "./token";

const group = 'web_es_11';
// const token = 'aeb303a7-85a3-41cc-b9b3-71f2eddd73ac';
const token = getToken();
// export const url = `https://around.nomoreparties.co/v1/${group}`;
export const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export const configHeaders = {
  accept: 'application/json',
  // token,
  token: `Bearer ${token}`,
  type: 'application/json',
  
}
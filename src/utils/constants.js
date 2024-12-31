import { getToken } from "./token";

const group = 'web_es_11';
const APIToken = 'aeb303a7-85a3-41cc-b9b3-71f2eddd73ac';
const AUTHToken = getToken();
export const API_URL = `https://around.nomoreparties.co/v1/${group}`;
export const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export const AuthConfigHeaders = {
  accept: 'application/json',
  token: `Bearer ${AUTHToken}`,
  type: 'application/json',
}

export const ApiConfigHeaders = {
  token: APIToken,
  type: 'application/json',
}
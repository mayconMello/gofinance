const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

const BASE_URI_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth'
const BASE_URI_PROFILE = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
const RESPONSE_TYPE = 'token';
const SCOPE = encodeURI('profile email');

const params = new URLSearchParams({
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: RESPONSE_TYPE,
  scope: SCOPE
} as {})

export const authUrl = `${BASE_URI_AUTH}?${params.toString()}`

export function uriProfile(token: string) {
  return `${BASE_URI_PROFILE}&access_token=${token}`
}
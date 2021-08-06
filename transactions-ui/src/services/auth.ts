import axios, { AxiosInstance } from "axios";

const LS_TOKEN_KEY = 'novusToken'

export class Unauthorized extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class AuthService{
  private api:AxiosInstance

  constructor(api_url:string){
    this.api = axios.create({baseURL:api_url})
  }

  async login(username:string, password:string){
    const res = await this.api.post('/auth/login', {username, password})
    if(res.status !== 200){
      throw new Unauthorized()
    }
    localStorage.setItem(LS_TOKEN_KEY, JSON.stringify(res.data))
  }

  getCurrentUser(): string | undefined{
    const tokenString = localStorage.getItem(LS_TOKEN_KEY)
    const authObject:{user_id:string} =  tokenString && JSON.parse(tokenString)
    if(authObject) return authObject.user_id
  }

  getCurrentToken(): string | undefined{
    const tokenString = localStorage.getItem(LS_TOKEN_KEY)
    const authObject:{token:string} =  tokenString && JSON.parse(tokenString)
    if(authObject) return authObject.token
  }

  logout(){
    localStorage.removeItem(LS_TOKEN_KEY)
  }

  static getAuthenticationHeader(){
    const tokenJson = localStorage.getItem(LS_TOKEN_KEY)
    if(!tokenJson) throw new Unauthorized();
    try{
      const {token} = JSON.parse(tokenJson)
      return {Authorization: `Bearer ${token}`}
    }
    catch{
      throw new Unauthorized()
    }
  }

}
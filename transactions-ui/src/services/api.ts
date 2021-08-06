import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Movement, MovementCreation } from "../schemas";
import { AuthService } from "./auth";

class Unauthorized extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class ApiService{
  private api:AxiosInstance

  constructor(api_url:string){
    this.api = axios.create({baseURL:api_url})
  }

  async listMovements(){
    const res = await this.api.get('/movements', {headers:AuthService.getAuthenticationHeader()})
    if(res.status !== 200) throw new Unauthorized();
    return res.data
  }

  async retrieveMovement(id:string):Promise<Movement>{
    const res = await this.api.get(`/movements/${id}`, {headers:AuthService.getAuthenticationHeader()})
    // if(res.status !== 200) throw new Unauthorized();
    console.log(res)
    return res.data as Movement
  }

  async createMovement(movement:MovementCreation) : Promise<Movement>{
    const res = await this.api.post(`/movements`, movement,{headers:AuthService.getAuthenticationHeader()})
    if(res.status !== 201) throw new Unauthorized();
    return res.data as Movement
  }

  async updateComment(id:string, comment:string) : Promise<void>{
    const res = await this.api.patch(`/movements/${id}`, {comment},{headers:AuthService.getAuthenticationHeader()})
    if(res.status !== 201) throw new Unauthorized();
  }

  async listOtherUsers(){
    const res = await this.api.get(`/users`, {headers:AuthService.getAuthenticationHeader()})
    if(res.status !== 200) throw new Unauthorized();
    return res.data
  }
  
}

export async function handleResponse(response:AxiosResponse) {
  if([401,403].indexOf(response.status) >= 0){
  }
}
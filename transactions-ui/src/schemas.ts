export interface Movement{
  id:string,
  amount:number,
  booked: boolean,
  comment: string,
  currency:string,
  description?:string,
  partner?:string,
  user_id:string,
  created_at:Date,
  modified_at:Date
}

export interface MovementCreation{
  amount:number,
  currency:string,
  partner?:string,
}

export interface Currency{
  symbol: string,
  name: string,
  symbol_native: string,
  decimal_digits: number,
  rounding: number,
  code: string,
  name_plural: string
}
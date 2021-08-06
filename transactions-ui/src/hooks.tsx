import * as React from "react"
import { ApiService } from "./services/api"
import { AuthService } from "./services/auth"
import currencies from "./currencies.json"
import { Currency, Movement } from "./schemas"

const DEFAULT_API_URL = process.env.NOVUS_API_URL || 'http://localhost:5000'

export function useAuth(api_url:string = DEFAULT_API_URL):AuthService {
  return new AuthService(api_url)
}

export function useApi(api_url:string = DEFAULT_API_URL):ApiService {
  return new ApiService(api_url)
}


export enum MovementDirection {
  Income = 'in',
  Outcome = 'out'
}


const CURRENCIES = currencies as any

export const useCurrency = (currency_id:string='EUR') => {
  const currency = CURRENCIES[currency_id] as Currency

  const toAmountFunc = (cents:number) => {
    return cents / Math.pow(10, currency.decimal_digits)
  }
  return {
    currencies: CURRENCIES,
    toAmount: toAmountFunc,
    toCents: (price:number) => {
      return price * Math.pow(10, currency.decimal_digits)
    },
    toCurrencyAmount: (cents:number, cur:Currency = currency, direction:MovementDirection = MovementDirection.Income) => {
      cur = cur || currency
      return `${direction === MovementDirection.Income ? '+' : '-'} ${cur.symbol} ${toAmountFunc(cents).toFixed(cur.decimal_digits)}`
    }
  }
}


// Not a hook, just a helper
export const getTitle = (movement:Movement, direction:MovementDirection) => {
  if(direction === MovementDirection.Income) return `From ${movement.user_id}`
  if(movement.partner) return `To ${movement.partner}`
  return movement.description
}

export const getMovementDirection = (movement:Movement, user_id:string) => {
  if(movement.partner && movement.partner === user_id) return MovementDirection.Income
  return MovementDirection.Outcome
}
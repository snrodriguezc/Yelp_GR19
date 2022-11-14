import { URL } from "../constants/urlConstants"
import axios from "axios"

export const getCoefficients = async() =>{
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const { data } = await axios.post(URL + 'coefficients', {}, config)
  return data
}

export const getReport = async() =>{
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const { data } = await axios.post(URL + 'report', {}, config)
  return data
}

export const getPrediction = async(params) =>{
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    }
  }
  const { data } = await axios.post(URL + 'predict', params, config)
  return data
}

export const goTrain = async(params) =>{
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    }
  }
  const { data } = await axios.post(URL + 'train', params, config)
  return data
}
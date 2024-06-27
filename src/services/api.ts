import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'

import { AuthTokenError } from './errors/AuthTokenError'
import { signOut } from '../context/AuthContext'

export function setupAPIClient(ctx = undefined){  //Passamos nosso setup API pro context e ele começa como UNDEFINED
    let cookies = parseCookies(ctx)              //Analisando os cookies do contexto fornecido ou do contexto padrão

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers:{
        Authorization:  `Bearer ${cookies['@saloon.token']}` //Armazenamos nosso cookie ja nessa variavel
        }
    })

    api.interceptors.response.use(response => {    // Interceptando as respostas da API para lidar com possíveis erros
        return response
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            if(typeof window !== undefined){
                signOut()   //Deslogar o USUARIO
            }else{
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error) // Se o erro não for relacionado à autenticação, simplesmente rejeitamos a promessa com o erro original

    })

    return api
}


//NESTE FILE basicamente configuramos nossa base URL para as requisicoes e suas devidas tratativas de erros.
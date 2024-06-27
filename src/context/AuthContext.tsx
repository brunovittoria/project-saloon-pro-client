import { createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie,parseCookies } from 'nookies' //Servira quando fizermos o logout, para destruir o cookies.
import Router from 'next/router'

import { api } from '../services/apiClient'

// Definindo a estrutura de dados para o contexto de autenticação
interface AuthContextData {
    user:   UserProps           // Dados do usuário autenticado
    isAuthenticated: boolean    // Indica se o usuário está autenticado ou não
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
}

// Definindo a estrutura de dados para o usuário
interface UserProps {
    id: string
    name: string
    email: string
    adress: string | null
    subscriptions?: SubscriptionProps | null     //O usuario pode vir com a sub null ou com um objeto de assinatura Colocamos o ponto de ? pois nao é obrigatorio o envio da sub em nosso codigo.
}

// Definindo a estrutura de dados para a assinatura
interface SubscriptionProps {           //Criamos um contrato separado para o Subscription pois dentro dele tem outras props
    id: string;
    status: string;
}

// Props necessárias para o provedor de autenticação que provem pra nossa aplicaçao GERAL
type AuthProviderProps = {
    children: ReactNode // Elementos filhos que serão envolvidos pelo provedor de autenticação
}

interface SignInProps {
    email: string
    password: string
}

interface SignUpProps {
    name: string
    email: string
    password: string
}

// Criando o contexto de autenticação
export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    console.log("ERRO LOGOUT!")
    try{
        destroyCookie(null, '@saloon.token', { path: '/'})
        Router.push('/login')
    }catch(err){
        console.log("Error nel logout")
    }
}

// Componente do provedor de autenticação
export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()       // Estado para armazenar as informações do usuário
    const isAuthenticated = !!user                      //As !! converte o valor em BOOLEAN Se nao tiver informaçoes o isAuthenticated ira retornar falso, se tiver infos no user ira retornar TRUE.

    useEffect(() => {
        const { '@saloon.token': token} = parseCookies()

        if(token){                                      //Aqui fazemos basicamente uma validaçao se o token esta correto, se nao estiver por conta que o usuario mudou, ele sera expulso da nossa app.

            api.get('/me').then(response => {
                const { id, name, adress, email, subscriptions } = response.data

                setUser({ id, name, adress, email, subscriptions })
            })
            .catch(() => {
                signOut()
            })

        }

    }, [])

    async function signIn({ email, password }: SignInProps){
        try{
            const response = await api.post("/session", {
                email,
                password
            })
            console.log(response.data)
            const { id, name, token, subscriptions, adress} = response.data //Fazemos o desconstructioring dos dados que queremos passar no cookies e na UseState

            setCookie(undefined, '@saloon.token', token, { //O SetCookie pede um contexto, porem como nao temos um ja que estamos no frontend, passamos como undefined. Como 2° param. passamos o token para dentro do cookie
                maxAge: 60 * 60 * 24 * 30,                //Tempo de expiraçao do cookie (Nesse caso de 1 mes)
                path: '/'                                 //Com o path setamos quais caminhos tem acesso ao nosso token, nesse caso damos acesso geral
            })

            setUser({                                    //Agora dentro da useState passamos as informaçoes para que elas fiquem armazenadas
                id,
                name,
                email,
                adress,
                subscriptions
            })
            
            console.log("Cai no TRY")
            api.defaults.headers.common['Authorization'] = `Bearer ${token}` //Agora passamos um HEADER do tipo TOKEN para nossa requisiçao a rota do backend, pra que o usuario possa injetar o token e logar
            
            Router.push('/dashboard')                                       //Uma vez que ele logou e o token foi salvo no header e COOKIES, vamos enviar o user pra tela de DASHBOARD

        } catch(err){
            console.log("Error on login", err)
        }
    }

    async function signUp({ name, email, password}: SignUpProps){
        try{
            const response = await api.post('/users', {name, email, password}) //Simplesmente passamos os dados para o nosso backend tratar 

            Router.push('/login')                   //Caso tenha criado com sucesso o user mandamos ele pro login, para ele se logar
        } catch(err){
            console.log(err)
        }
    }

    async function logoutUser(){            //Esta funçao ira deslogar e destruir o token do user
        try{
            destroyCookie(null, '@saloon.token', { path: '/' })
            Router.push('/login')
            setUser(null)           //Retiramos tudo que tinha na useState do user e limpamos para null
        }catch(err){
            console.log("Logout error", err)
        }
    }

    return(
        // Fornecendo o contexto de autenticação para os elementos filhos(Toda a nossa APLICACAO)
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser}}> 
            {children}
        </AuthContext.Provider>
    )
}

//EXPLICACAO DESTE FILE:

//Essencialmente, este arquivo define um contexto de autenticação (AuthContext) que fornece informações sobre o usuário autenticado e seu status de autenticação para os componentes filhos. Ele utiliza o useState do React para armazenar as informações do usuário e determina se o usuário está autenticado com base nessas informações.
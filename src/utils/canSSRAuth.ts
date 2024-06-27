import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"; //Antes de renderizar algo ao user passamos pelo servidor 
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function canSSRAuth<P>(fn: GetServerSideProps<P>){        //Passamos um generic do tipo P para esta funçao
    return async (ctx: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx)

        const token = cookies['@saloon.token']

        if(!token){
            return{
                redirect:{
                    destination: '/login',
                    permanent: false
                }
            }
        }

        try{
            return await fn(ctx)
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@saloon.token', { path: '/'})


                return{
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
        
    }
}

//Basicamente neste file iremos criar um bloco de codigo que verifica se o usuario tem o token ou nao para estar em determinada rota, caso ele nao tenha sera redirecionado para fora da rota que ele tentou entrar.
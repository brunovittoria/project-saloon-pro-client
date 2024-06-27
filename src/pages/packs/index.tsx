import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react'

import Head from 'next/head'

import { Sidebar } from '../../components/sidebar'

import { canSSRAuth } from '../../utils/canSSRAuth'
import { setupAPIClient } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface PlanoProps{
    premium: boolean
}

export default function Planos( {premium} : PlanoProps){
    const [isMobile] = useMediaQuery('(max-width: 500px)')

    const handleSubscribe = async () => {
        //Barramos o usuario caso ele ja seja premium e tente pagar dnv
        if(premium){
            return
        }

        try{
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/subscribe')

            const { sessionId } = response.data //Pegamos a sessionId que o nosso backend nos devolve depois que executamos o post acima

            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId: sessionId})    //Para criar a sessao de checkout mandamos a sessionId AQUI

        }catch(err){
            console.error(err)
        }

    }

    async function handleCreatePortal(){

        try{

            if(!premium){
                return;
            }

            const apiClient = setupAPIClient()
            const response = await apiClient.post("/create-portal")

            const { sessionId } = response.data

            window.location.href = sessionId //Pegamo a aba em que o usuario se encontra no momento e mandamos ele para uma nova aba com a sessao do portal dele

        }catch(err){
            console.error(err)
        }

    }

    return(
        <>
            <Head>
                <title>SaloonPro - Il tuo piano Premium</title>
            </Head>

            <Sidebar>

                <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
                    <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
                        Piani
                    </Heading>
                </Flex>

                <Flex pb={8} maxH="780px" w="100%" direction="column" align="flex-start" justify="flex-start">

                    <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>
                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading 
                                textAlign="center" 
                                fontSize="2xl" 
                                mt={2} 
                                mb={4} 
                                color="gray.100">
                                Piano Gratis
                            </Heading>

                            <Text fontWeight="bold" ml={4} mb={2}>Inserire Servizi.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Crea apenna 3 tipi di servizi.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Modificare dati del profilo.</Text>
                        </Flex>

                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading 
                                textAlign="center" 
                                fontSize="2xl" 
                                mt={2} 
                                mb={4} 
                                color="#31fb6a">
                                Piano Premium
                            </Heading>

                            <Text fontWeight="medium" ml={4} mb={2}>Inserire servizi Ilimitati.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Notifica appuntamento automatica su whatsapp per i tuoi clienti .</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Crea Modelli Ilimitati.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Modificare servizi.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Riceverai Aggiornamenti del software.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Collegamento della agenda con google calendar.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Modificare dati del profilo.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Gestione Team</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Dashboard Fatturato</Text>
                            <Text fontWeight="bold"   ml={4} mb={2} fontSize={"2xl"} color="#31fb6a">€ 19.97</Text>

                            <Button
                                bg={premium ? "transparent" : "button.cta"}
                                m={2}
                                color="white"
                                onClick={handleSubscribe}
                                disabled={premium}
                            >
                                {premium ? (
                                    "SEI GIA PREMIUM!"
                                ) : (
                                    "DIVENTA PREMIUM"
                                )}
                            </Button>

                            {premium && (
                                <Button
                                    m={2}
                                    bg="white"
                                    color="barber.900"
                                    fontWeight="bold"
                                    onClick={handleCreatePortal}
                                >
                                    CAMBIA ABBONAMENTO
                                </Button>
                            )}

                        </Flex>
                    </Flex>

                </Flex>

            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth( async (ctx) => {

    try{

        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/me')

        return {
            props: {
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }

    }catch(err){
        console.log(err)

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }

    }

})
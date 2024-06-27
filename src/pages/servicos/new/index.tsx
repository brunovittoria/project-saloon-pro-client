import { useState } from 'react'
import Head from 'next/head'
import { Sidebar } from '../../../components/sidebar'
import { FiChevronLeft} from 'react-icons/fi'
import { canSSRAuth } from '../../../utils/canSSRAuth'

import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input
} from '@chakra-ui/react'

import Link from 'next/link'
import Router from 'next/router'

import { setupAPIClient } from '../../../services/api'

interface NewServiceProps{
    subscription: boolean;
    count: number
}

export default function NewService({ subscription, count }: NewServiceProps){ //Recebemos as props do nosso backend e dps de passar pra interface passamos pro componente
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    async function handleRegister(){
        console.log({name, price})

        try{
            const apiClient = setupAPIClient()
            await apiClient.post('/service', {
                name: name,
                price: Number(price),
            })

            Router.push("/servicos")
        } catch(err){
            console.log(err)
            alert("Erro ao cadastrar esse modelo.")
        }
    }

    return(
        <>
            <Head>
                <title>SaloonPRO - Nuovo Servizio</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex mb={isMobile ? 4 : 0} direction={isMobile ? "column" : "row"} w="100%" align={isMobile ? "flex-start" : "center"}>
                        <Link href="/servicos">
                            <Button color="#FFF" bg="barber.400" p={4} display="flex" alignItems="center" justifyItems="center" mr={4} _hover={{ background: 'gray.700'}}>
                                <FiChevronLeft size={24} color="#FFF"/>
                                Torna
                            </Button>
                        </Link>

                        <Heading color="orange.900" mt={4} mb={4} mr={4} fontSize={isMobile ? "28px" : "3xl"}>Servizi</Heading>
                    </Flex>

                    <Flex direction="column" maxH="700px" bg="barber.400" w="100%" align="center" justify="center" pt={8} pb={8}>
                        <Heading mb={4} fontSize={isMobile ? "28px" : "3xl"}>
                            Registra Servizio
                        </Heading>
                        <Input 
                            value={name}
                            onChange={(e) => setName(e.target.value) }
                            placeholder="Nome del servizio"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={3}
                        />

                        <Input 
                            value={price}
                            onChange={(e) => setPrice(e.target.value) }
                            placeholder="Prezzo"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={4}
                        />

                        <Button onClick={handleRegister} w="65%" size="lg" color="gray.900" mb={6} bg="button.cta" _hover={{ bg:  "#FFb13e"}} disabled={!subscription && count >= 3}>
                            Registrare
                        </Button>

                        {!subscription && count >= 3 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text>
                                    Hai raggiunto la tua quota di servizi.
                                </Text>
                                <Link href="/piani">
                                    <Text fontWeight="bold" color="#31FB6A" cursor="pointer" ml={1}> 
                                        Diventa Premium 
                                    </Text>
                                </Link>
                            </Flex>
                        )}
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/service/check') //Aqui retorna o tipo de assinatura que o user tem
        const count = await apiClient.get('/service/count')    //Aqui retorna em numeros a QTD de servicos que o user tem

        return {
            props:{                                             //Iremos passar essas infos por props ao nosso frontend
                subscription: response.data?.subscriptions?.status === "active" ? true : false,
                count: count.data //Aqui ira retornar um number
            }
        }

    } catch(err){
        console.log(err)

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }

})
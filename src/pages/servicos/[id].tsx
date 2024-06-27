import { useState, ChangeEvent  } from "react";
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch
} from '@chakra-ui/react'

import { Sidebar } from "../../components/sidebar";
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { setupAPIClient } from "../../services/api";

import { canSSRAuth } from '../../utils/canSSRAuth'

interface ServiceProps{
    id: string
    name: string
    price: string | number
    status: boolean
    user_id: string
}

interface SubscriptionProps{
    id: string
    status: string
}

interface EditServiceProps{
    services: ServiceProps
    subscription: SubscriptionProps | null //Pois o usuario pode nao ter nenhuma assinatura
}

export default function EditHaircut({ subscription, services}: EditServiceProps){
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [name, setName] = useState(services?.name)    //Ja inicia com o valor recuperado do backend na state
    const [price, setPrice] = useState(services?.price)
    const [status, setStatus] = useState(services?.status)

    const [disableService, setDisableService] = useState(services?.status ? "disabled" : "enabled") // Se o STATUS for true setamos como disables, se for false como enabled... n entendi o pq disso mt bem mas ok

    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
        if(e.target.value === "enabled"){
            setDisableService("enabled")
            setStatus(false)
        } else {
            setDisableService("disabled")
            setStatus(true)
        }
    }

    async function handleUpdate(){
        if(name === "" || price === ""){    //Se o user inserir dados vazios ele nao ira poder salvar
            return                                                  
        }

        try{

            const apiClient = setupAPIClient()
            await apiClient.put('/service', {
                name: name,
                price: Number(price),
                status: status,
                work_id: services?.id
            })

            alert("Service atualizado com sucesso")
        }catch(err){
            console.error(err)
        }

    }

    return(
        <>
            <Head>
                <title>Modificando servizio - SaloonPRO</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex 
                        direction={isMobile ? "column" : "row"} 
                        w="100%" 
                        alignItems={isMobile ? "flex-start" : "center"} 
                        justifyContent="flex-start" 
                        mb={isMobile ? 4 : 0}
                    >
                        <Link href="/servicos">
                            <Button mr={3} p={4} display="flex" alignItems="center" justifyContent="center" color="#FFF" bg="barber.400" _hover={{ background: 'gray.700'}}>
                                <FiChevronLeft size={24} color="#FFF"/>
                                Torna
                            </Button>
                        </Link>

                        <Heading fontSize={isMobile ? "22px" : "3xl"} color="white">
                            Modifica
                        </Heading>
                    </Flex>

                    <Flex mt={4} maxH="700px" pt={8} pb={8} w="100%" bg="barber.400" direction="column" align="center" justify="center">
                        <Heading fontSize={isMobile ? "22px" : "3xl"}>Modifica Servizio</Heading>

                        <Flex w="85%" direction="column">
                            <Input
                                placeholder="Nome del Servizio"
                                bg="gray.900"
                                mb={3}
                                size="lg"
                                type="text"
                                mt={4}
                                w="100%"
                                value={name}
                                onChange={ (e) => setName(e.target.value) }
                            />

                            <Input
                                placeholder="Prezzo del tuo servizio ex: 45.70"
                                bg="gray.900"
                                mb={3}
                                size="lg"
                                type="number"
                                w="100%"
                                value={price}
                                onChange={ (e) => setPrice(e.target.value) }
                            />

                            <Stack mb={6} align="center" direction="row">
                                <Text fontWeight="bold">Disattivare Servizio</Text>
                                <Switch
                                    size="lg"
                                    colorScheme="red"
                                    value={disableService}
                                    isChecked={disableService === "disabled" ? false : true}
                                    onChange={ (e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e) }
                                />
                            </Stack>

                            <Button 
                                mb={6} 
                                w="100%" 
                                bg="button.cta" 
                                color="gray.900" 
                                _hover={{ bg: "#FFB13e"}} 
                                disabled={subscription?.status !== "active"}
                                onClick={handleUpdate}
                            >
                                Salva
                            </Button>

                            { subscription?.status !== "active" && (
                                <Flex direction="row" align="center" justify="center">
                                    <Link href="/packs">
                                        <Text fontWeight="bold" mr={1} color="#31fb6a">
                                            Diventa Premium
                                        </Text>
                                    </Link>
                                    <Text>
                                        e libera tutte le funzionalita.
                                    </Text>
                                </Flex>
                            )}

                        </Flex>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params

    try{
        const apiClient = setupAPIClient(ctx)

        const check = await apiClient.get('/service/check') //Rota responsavel por verificar se o user tem subcription

        const response = await apiClient.get('/service/detail', {
            params: {
                work_id: id
            }
        })

        return{ //Aqui retornamos os valores pro nosso frontend
            props:{
                service: response.data,  //Iremos retornar o response data na prop service
                subscription: check.data?.subscriptions
            }
        }

    }catch(err){
        console.log(err)

        return{
            redirect:{
                destination: "/servicos",
                permanent: false,
            }
        }
    }
})
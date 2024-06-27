import Head from "next/head";
import { use, useState } from "react";

import { 
    Flex, 
    Text, 
    Heading, 
    Link as ChakraLink, 
    useMediaQuery,
    Button, 
    textDecoration,
    useDisclosure
} from '@chakra-ui/react'

import Link  from 'next/link'

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { IoMdPerson } from "react-icons/io";
import { setupAPIClient } from "../../services/api";
import { ModalInfo } from '../../components/modal'

export interface ScheduleItem{
    id: string
    customer: string
    haircut: {
        id: string
        name: string
        price: string | number
        user_id: string
    }
}


interface DashboardProps{
    schedule: ScheduleItem[]
}

export default function Dashboard({ schedule }: DashboardProps ){ //Criamos uma interface para armazenar os dados do BE que recebemos via props em uma outra interface de array
    const [list, setList] = useState(schedule)
    const { isOpen, onOpen, onClose} = useDisclosure() //Funcionalidade ja presente dentro do CHAKRAUI

    const [service, setService] = useState<ScheduleItem>()

    const [isMobile] = useMediaQuery("(max-width: 500px)")

    function handleOpenModal(item: ScheduleItem){
        setService(item)                                    //Passamos o service para dentro da nossa STATE que ira carregas as INFOS AO ABRIR NOSSA MODAL
        onOpen()
    }

    async function handleFinish(id: string){ //Aqui iramos chamar a rota para deletar um agendamento

        try{
            const apiClient = setupAPIClient()
            await apiClient.delete('/schedule', {
                params:{
                    schedule_id: id
                }
            })

            const filterItem = list.filter(item => { //Para que o CLIENTE suma da lista de AGENDAMENTO devemos percorrer a STATE e eliminarlo
                return (item?.id !== id) //Retorne o itemID diferente do que cliquei pra finalizar
            })

            setList(filterItem) //Passasmo no state a lista atualizada com o cliente removido
            onClose()


        }catch(err){
            console.log(err)
            onClose()
            alert("Erro ao finalizar serviço")
        }

    }

    return(
        <>
            <Head>
                <title>SaloonPRO - Mio Negozio</title>
            </Head>
            <Sidebar>
                <Flex direction="column" align="flex-start" justify="flex-start">

                    <Flex w="100%" direction="row" align="center" justify="flex-start">
                        <Heading fontSize={isMobile ? "28px" : "3xl"} mt={4} mb={4} mr={4} color="orange.900">
                            Benvenuto al Dashboard
                        </Heading>

                        <Link href="/new">
                            <Button >Registrare</Button>
                        </Link>
                    </Flex>

                    {list.map(item => ( //Fazendo o map do array que criamos na nossa interface de props
                        <ChakraLink 
                            key={item?.id} 
                            w="100%" 
                            m={0} 
                            p={0} 
                            mt={1} 
                            bg="transparent" 
                            style={{ textDecoration: "none" }} 
                            onClick={() => handleOpenModal(item)}
                        >
                            <Flex 
                                w="100%" 
                                direction={isMobile ? "column" : "row"} 
                                p={4} 
                                rounded={4} 
                                mb={2} 
                                bg="barber.400" 
                                justify="space-between" 
                                align={isMobile ? "flex-start" : "center"}
                                >

                                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    <IoMdPerson size={28} color="#f1f1f1"/>
                                    <Text fontWeight="bold" ml={4} noOfLines={1}>
                                        {item?.customer}
                                    </Text>
                                </Flex>

                                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                                    {item?.haircut?.name}
                                </Text>
                                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                                    € {item?.haircut?.price}
                                </Text>

                            </Flex>
                        </ChakraLink>
                    ))}

                </Flex>
            </Sidebar>

            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service} //Iremos pegar o data e inserir ele dentro de uma useState para que possamos renderizarlo aqui
                finishService={  () => handleFinish(service?.id) }
            />

        
        </>
    )
}

//Abaixo iremos proteger nossa rota com nosso canSSRAuth:
export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/schedule') //Iremos fazer o get dessa rota para listar os dados dos clientes em nosso dashboard

        return{
            props:{
                schedule: response.data,
            }
        }

    }catch(err){
        console.log(err)
        return{
            props:{
                schedule: []
            }
        }

    }
})
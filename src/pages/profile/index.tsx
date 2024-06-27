import { useContext, useState } from 'react'
import Head from 'next/head'
import {
    Flex,
    Text,
    Heading,
    Box,
    Input,
    Button,
    useMediaQuery
} from '@chakra-ui/react'
import { Sidebar } from '../../components/sidebar'
import Link from 'next/link'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { AuthContext } from '../../context/AuthContext'
import { setupAPIClient } from '../../services/api' //Usamos para carregar informacoes do backend nos campos do perfil

interface UserProps{
    id: string
    name: string
    email: string
    adress: string | null
}

interface ProfileProps{
    user: UserProps
    premium: boolean
}

export default function Profile({ user, premium }: ProfileProps){
    const { logoutUser } = useContext(AuthContext)

    const [name, setName] = useState(user && user?.name)        //Como queremos pegar esse valor do BE nao inicializamos ele vazio
    const [adress, setAdress] = useState(user && user?.adress)  //O ? é so um operador do JS que caso ele vir vazio ira manter vazio

    const [isMobile] = useMediaQuery("(max-width: 500px)")

    async function handleLogout(){
        await logoutUser()
    }

    async function handleUpdateUser(){  //Tornamos essa funçao em ASYNC pois ela deve comunicar com a API

        if(name == ""){
            return
        }

        try{
            const apiClient = setupAPIClient()
            await apiClient.put('/users', {
                name: name,
                adress: adress,
            })

            alert("Dados alterados")
        
        }catch(err){
            console.log(err)
        }

    }

    return(
        <>
            <Head>
                <title>Mio Account - SaloonPRO </title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
                        <Heading fontSize={isMobile ? "28px" : "3xl"} mt={4} mb={4} mr={4} color="orange.900">Mio Account</Heading>
                    </Flex>

                    <Flex pt={8} pb={8} background="barber.400" maxH="700px" w="100%" direction="column" alignItems="center" justifyContent="center">

                        <Flex direction="column" w="85%">
                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">Nome del tuo saloon:</Text>
                            <Input
                                w="100%"
                                background="gray.900"
                                placeholder="Nome del tuo saloon:"
                                size="lg"
                                type="text"
                                mb={3}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">Indirizzo del tuo saloon:</Text>
                            <Input
                                w="100%"
                                background="gray.900"
                                placeholder="Indirizzo del tuo saloon"
                                size="lg"
                                type="text"
                                mb={3}
                                value={adress}
                                onChange={(e) => setAdress(e.target.value)}
                            />

                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">Piano attuale:</Text>

                            <Flex
                                direction="row"
                                w="100%"
                                mb={3}
                                p={1}
                                borderWidth={1}
                                rounded={6}
                                background="barber.900"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Text p={2} fontSize="lg" color={premium ? "#FBA931" : "#4dffb4"}>
                                    Piano {premium ? "Premium" : "Gratis"}
                                </Text>

                                <Link href="/packs">
                                    <Box 
                                        cursor="pointer" 
                                        p={1} 
                                        pl={2} 
                                        pr={2} 
                                        background="#00cd52" 
                                        rounded={4} 
                                        color="white"
                                    >
                                        Aggiorna Piano
                                    </Box>
                                </Link>
                            </Flex>

                            <Button
                                w="100%"
                                mt={3}
                                mb={4}
                                bg="button.cta"
                                size="lg"
                                _hover={{ bg: '#ffb13e' }}
                                color="white"
                                onClick={handleUpdateUser}
                            >
                                Salva
                            </Button>

                            <Button
                                w="100%"
                                mb={6}
                                bg="transparent"
                                borderWidth={2}
                                borderColor="red.500"
                                color="red.500"
                                size="lg"
                                _hover={{ bg: 'transparent' }}
                                onClick={handleLogout}
                            >
                                Esci dal account
                            </Button>

                        </Flex>

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/me')

        const user = {          //Fazemos o desconstructioring dos dados que o backend nos passa no response para que possamos passar esses dados em nosso componente PROFILE
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            adress: response.data?.adress
        }

        return{ 
            props: {
                user: user,          //Desta forma passamos as infos do BE via props em nosso INTERFACE ao nosso componente PROFILE
                premium: response.data?.subscriptions?.status === "active" ? true : false
            }
        }

    } catch(err){
        console.log(err)

        return{ redirect:{ destination: '/dashboard', permanent: false }}
    }

})

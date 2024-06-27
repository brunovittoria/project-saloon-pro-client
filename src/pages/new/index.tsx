import { useState, ChangeEvent } from 'react'
import Head from "next/head"
import { Sidebar } from "../../components/sidebar"
import { setupAPIClient } from '@/services/api'

import { 
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Select
} from '@chakra-ui/react'

import { canSSRAuth } from '@/utils/canSSRAuth'

import { useRouter } from 'next/router'

interface ServiceProps{
  id: string
  name: string
  price: string | number
  status: boolean
  user_id: string
}

interface ServiceListProps{
  services: ServiceProps[]
}

export default function New({ services } : ServiceListProps){

  const [customer, setCustomer] = useState('')
  const [serviceSelected, setServiceSelected] = useState(services[0]) //O Option ira começar por default na posiçao 0
  const router = useRouter()

  function handleChangeSelect(id: string){
    
    const serviceItem = services.find(item => item.id === id) //Busca por um item igual do que voce selecionou no select e o armazena nesta variavel
    
    setServiceSelected(serviceItem) //Passamos para nossa useState o servico selecionado
  }

  async function handleRegister(){

    if(customer === ""){
      alert("Preencha o nome do cliente")
      return
    }

    try{
      const apiClient = setupAPIClient()
      await apiClient.post('/schedule', {
        customer: customer,
        haircut_id: serviceSelected?.id
      })

      router.push('/dashboard') //Quando cadastrar os dados do CUSTOMER, redirecionamos para a page principal
      
    }catch(err){
      console.error(err)
    }

  }

  return(
    <>

      <Head>
        <title>BarberPro - Nuovo Appuntamento</title>
      </Head>
      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex
            direction="row"
            w="100%"
            align="center"
            justify="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
              Nuovo taglio
            </Heading>
          </Flex>

          <Flex 
            maxW="700px"
            pt={8}
            pb={8}
            width="100%"
            direction="column"
            align="center"
            justify="center"
            bg="barber.400"
          >
            <Input
              placeholder="Nome do cliente"
              w="85%"
              mb={3}
              size="lg"
              type="text"
              bg="barber.900"
              value={customer}
              onChange={ (e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value) }
            />

            <Select bg="barber.900" mb={3} size="lg" w="85%" onChange={ (e) => handleChangeSelect(e.target.value) }>
              {services?.map( item => (
                <option key={item?.id} value={item?.id}>{item?.name}</option>
              ))}
            </Select>

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: '#FFb13e' }}
              onSubmit={handleRegister}
            >
              Invia
            </Button>

          </Flex>

        </Flex>
      </Sidebar>
      
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  try{

    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/services', { //Rota que lista servicos
      params:{
        status: true,
      }
    }) 
      
    if(response.data === null){
      return{
        redirect:{
          destination: '/dashboard',
          permanent: false,
        }
      }
    }

    return{
      props: {
        services: response.data
      }
    }

  }catch(err){
    console.error(err)

    return{
      redirect:{
        destination: '/dashboard',
        permanent: false
      }
    }

  }
  
})
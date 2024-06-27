import Head from "next/head"
import { Flex, Text, Center, Input, Button } from '@chakra-ui/react'
import Image from "next/image"
import Logo from '../../../public/images/logo.svg'
import Link from "next/link"
import { useState, useEffect, useContext } from "react"

import { AuthContext } from "../../context/AuthContext"

import { canSSRGuest } from "../../utils/canSSRGuest"

export default function Login(){
    const { signIn } = useContext(AuthContext)

    const [email, setEmail]        = useState('')
    const [password, setPassword]  = useState('')

    async function handleLogin(){

        if(email === "" || password === ""){        //Ja barramos aqui para evitar de gastar memoria em nossa requisiçao do BE
            return
        }

        await signIn({email, password})
    }

    return(
        <>
            <Head>
                <title>SaloonPRO - Il tuo sistema completo</title>   {/*Aqui usamos o titulo para melhorar nosso SEO*/}
            </Head>
            <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center"> {/*Aqui basicamente importamos uma DIV que ja vem com o display flex*/}
                
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center p={4}>
                        <Image
                            width={240}
                            src={Logo}
                            quality={100}
                            objectFit="fill"
                            alt="Logo Saloon PRO"
                        />
                    </Center>

                    <Input
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="email@email.com"
                        type="email"
                        mb={3}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        color="white"
                    />

                    <Input
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="**********"
                        type="password"
                        mb={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        color="white"
                    />

                    <Button
                        background="button.cta"  //Esse button.cta pegamos do nosso theme
                        mb={6}
                        color="gray.100"
                        _hover={{ bg: "#ffb13e"}}
                        onClick={handleLogin}
                    >
                        Accedere
                    </Button>

                    <Center mt={2}>
                        <Link href="/register">
                            <Text cursor="pointer" color="#FFF">Non sei ancora registrato? <strong>Registrati</strong></Text>
                        </Link>
                    </Center>
                </Flex>

            </Flex>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return{
        props: {}
    }
})
'use client'
import Link from 'next/link'
import Typography from '@/components/landing-page/ui/typography'
import { Heart } from 'lucide-react'

import Logo from '../../../../public/images/logo.svg'
import Image from "next/image"

import { useMediaQuery } from '@chakra-ui/react'

export function Footer() {
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const phoneNumber = process.env.MY_WPP_NUMBER;

  return (
    <footer className="flex h-12 items-center justify-center w-full border-t">
      <div className="w-full max-w-[1280px] md:px-8 px-4 flex place-content-center">
        <div className="gap-x-11 md:flex flex-1 hidden">
          <Link
            href="/"
            className="pointer flex items-center"
          >
            <Image width={110} objectFit="fill" src={Logo} quality={100} alt='Saloon PRO Logo' className="mr-3"/>
          </Link>
        </div>
        <div className="flex max-w-fit items-center gap-x-4">
          <Link
            href={`http://wa.me/+${phoneNumber}`}
            target="_blank"
            className="pointer block w-fit flex-1"
          >
            <Typography variant="p" className="w-max" style={{ color: "#fff"}}>
              Prenota ora
            </Typography>
          </Link>
          
          <Link
            href="/terms-of-service"
            className="pointer block w-fit flex-1"
          >
            <Typography variant="p" className="w-max" style={{ color: "#fff"}}>
              Termini di servizio
            </Typography>
          </Link>

          <Link
            href="/privacy-policy"
            className="pointer block w-fit"
          >
            <Typography variant="p" style={{ color: "#fff"}}>
              Informativa sulla privacy
            </Typography>
          </Link>
          {!isMobile && (
            <Link
              href="https://bruno-vittoria.vercel.app/"
              className="pointer block w-fit"
              style={{marginLeft: "30px"}}
            >
              <Typography variant="p" className="w-max" style={{ color: "#fff", display: "flex", justifyContent: "center", alignContent: "center"}}>
                Sviluppato con <Heart size={16} style={{marginLeft: "5px", marginRight: "5px"}}/> da Bruno Vittoria
              </Typography>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}

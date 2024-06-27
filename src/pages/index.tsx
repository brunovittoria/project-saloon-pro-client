import Head from "next/head"
import { Button } from '@/components/landing-page/ui/button'
import Typography from '@/components/landing-page/ui/typography'
import Image from 'next/image'
import Link from "next/link"
import { ArrowUpDown, Timer, Workflow, BotMessageSquare, LayoutDashboard, Scissors } from 'lucide-react'

import { Header } from '../components/landing-page/header-lp/header'
import { Footer } from '../components/landing-page/footer/index'

import Feature from "@/components/landing-page/feature"

export default function Home(){
  const phoneNumber = process.env.MY_WPP_NUMBER;

  return(
    <>
      <Head>
        <title>Saloon Pro - Il tuo sistema completo</title>   {/*Aqui usamos o titulo para melhorar nosso SEO*/}
      </Head>
      <div className="flex flex-1 justify-center w-full">
        <Header />
      </div>
      <div
      className="flex flex-col h-full md:py-36 md:px-32 pt-11 pb-24 px-8
        w-full items-center text-center gap-12"
    >
      

      <div className="flex flex-col gap-6 items-center">
        <Typography className="max-w-2xl" variant="h1">
        Saloon PRO, IL Gestionale per il tuo Saloon
        </Typography>
        <Typography className="max-w-2xl" variant="h5" style={{ color: "#fff"}}>
          Invia automaticamente messaggi di promemoria su WhatsApp ai clienti una volta che sono stati inseriti nell agenda. Non dimenticare mai un appuntamento importante e assicurati che i tuoi clienti siano sempre informati.
        </Typography>
        <Link
          href="/register"
          target="_blank"
        >
          <Button size="tiny" variant="ghost" className="text-white" style={{ backgroundColor: "#FBB131"}} >
            {`Inizia Ora`}
          </Button>
        </Link>
        <Image
          width={1024}
          height={632}
          alt="Pandem.dev hero image"
          src="/hero1.png"
        />
      </div>
      <div className="flex flex-col md:pt-24 md:gap-36 gap-24 items-center">
        <div className="flex flex-col gap-12 items-center">
          <Typography className="max-w-2xl" variant="h1">
            Soluzioni semplici, meno stress
          </Typography>
          <div className="flex md:flex-row flex-col gap-12">
            <Feature
              icon={<BotMessageSquare size={24} />}
              headline="Promemoria Automatico "
              description="Invia automaticamente messaggi di promemoria su WhatsApp ai clienti una volta che sono stati inseriti nell'agenda. Non dimenticare mai un appuntamento importante e assicurati che i tuoi clienti siano sempre informati."
            />
            <Feature
              icon={<LayoutDashboard size={24} />}
              headline="Visualizzazione Dashboard"
              description="Accedi a una dashboard completa del tuo fatturato. Visualizza e analizza le entrate del tuo salone in modo semplice e intuitivo, aiutandoti a prendere decisioni informate per far crescere il tuo business."
            />
            <Feature
              icon={<Scissors size={24} />}
              headline="Creazione Servizi"
              description="Crea e personalizza vari tipi di tagli e servizi. Aggiungi facilmente questi servizi all'agenda dei tuoi clienti, assicurando una gestione efficiente e organizzata degli appuntamenti."
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-2xl items-center">
          <Typography className="max-w-2xl" variant="h1">
            Configurazione istantanea, senza codice personalizzato
          </Typography>
          <Typography className="max-w-2xl" variant="p" style={{ color: "#fff"}}>
          Basta accedere alla pagina di registrazione, iscriversi e iniziare con Saloon PRO!
          </Typography>
          <Image
            width={1024}
            height={632}
            alt="Pandem.dev hero image"
            src="/hero1.png"
          />
        </div>
        <div className="flex flex-col gap-6 items-center">
          <Typography className="max-w-2xl" variant="h1">
            Contattaci
          </Typography>
          <div>Fissa una call per iniziare con Saloon PRO</div>
          <Link
            href={`http://wa.me/+${phoneNumber}`}
            target="_blank"
          >
            <Button size="tiny" variant="ghost" className="text-white" style={{ backgroundColor: "#FBB131" }}>
              {`Prenota ora`}
            </Button>
          </Link>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  )
}
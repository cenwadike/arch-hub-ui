import { Inter } from '@next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Navigation() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center from-zinc-200 pb-6 pt-8 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4 text-4xl font-bold text-orange-600">
            Arch-Hub          
        </p>
        <div className="p-2 rounded-2xl bg-cover bg-orange-600 text-white hover:text-gray-200 hover:bg-orange-700 hover:p-3 font-mono font-semibold text-lg">
          <a 
            href="/navigation"
          >
            connect wallet
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-orange-200 after:via-orange-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-orange-700 before:dark:opacity-10 after:dark:from-orange-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <p className="text-4xl font-semibold text-orange-600">
          Decentralized Hub for Boundless Innovation!
        </p>
      </div>

      <div className="mb-32 flex justify-center text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left text-white animate-bounce">
        <Link
          href="/navigation"
          className="group px-5 py-3 bg-orange-600 rounded-2xl text-white"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Launch App{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none  ">
              -&gt;
            </span>
          </h2>
        </Link>
      </div>
    </main>
  );
}

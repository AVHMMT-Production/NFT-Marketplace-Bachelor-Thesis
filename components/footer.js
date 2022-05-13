import Link from 'next/link'
import Image from 'next/image'

export default function Footer(){


    return(
        <footer className="p-4 shadow md:px-6 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center ">
                    <Image src="/logo.png" width="40" height="40" className="h-10 w-10" />
                    <span className="text-gray-400 self-center text-2xl font-semibold whitespace-nowrap ml-4">NFTIO</span>
                </div>
                <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <Link href="#" className="mr-4 hover:underline md:mr-6 ">About</Link>
                    </li>
                    <li>
                        <Link href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link href="#" className="mr-4 hover:underline md:mr-6 ">Licensing</Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:underline">Contact</Link>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <div className="hover:underline">NFTIO™</div>. All Rights Reserved.
            </span>
        </footer>
    )
}
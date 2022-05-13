import { useMoralis } from "react-moralis";
import Link from 'next/link'
import { useRouter } from 'next/router';
import MobileMenu from '../components/mobilemenu';


export default function Navbar(){
    const { authenticate, isAuthenticated, isAuthenticating, logout } = useMoralis();
    const router = useRouter();
    
    const login = async () => {
        if (!isAuthenticated) {

            await authenticate({signingMessage: "Log in using Moralis" })
            .then(function (user) {
                console.log("logged in user:", user);
                console.log(user.get("ethAddress"));
                fetchNativeBalance();
                })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    const logOut = async () => {
    await logout();
    console.log("logged out");
    }

    return(
    <nav className="container flex justify-around py-8 mx-auto">
    <div className="flex items-center">
    <img className="h-8 w-8" src="/logo.ico" alt="Workflow" />
        <Link href="/test"> 
            <h3 className="text-2xl font-medium ml-4 text-indigo-400">NFTIO</h3>
        </Link>
    </div>
    
    
    <div className="items-center hidden space-x-8 md:flex">
        <Link href="/">
            <div className={router.pathname == "/" ? "text-fuchsia-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"}>Home</div>
        </Link>
        <Link href="/feed">
            <div className={router.pathname == "/feed" ? "text-fuchsia-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"}>Feed</div>
        </Link>
        <Link href="/create">
            <div className={router.pathname == "/create" ? "text-fuchsia-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"}>Upload NFT</div>
        </Link>
        <Link href="/dashboard">
            <div className={router.pathname == "/dashboard" ? "text-fuchsia-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"}>Dashboard</div>
        </Link>
    </div>

    <div className="md:hidden z-10" id="mobile-menu">
      <MobileMenu />
      </div>
    

    <div className="flex items-center space-x-2">
        <button hidden={isAuthenticated} className="font-bold text-white p-2 bg-cyan-500 shadow-lg shadow-cyan-500/50 dark:hover:shadow-lg dark:hover:shadow-blue-700/50 dark:hover:bg-blue-700  dark:focus:ring-blue-800 rounded float-right" onClick={login}>Moralis Metamask Login</button>
        <button hidden={!isAuthenticated} className="text-white bg-fuchsia-700 hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:fuchsia-fuchsia-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3 md:mr-0 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 dark:focus:ring-fuchsia-800" onClick={logOut} disabled={isAuthenticating}>Logout</button>
    </div>
    </nav>
    )
}
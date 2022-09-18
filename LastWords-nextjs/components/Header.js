import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">Last Words Gallery</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/your-last-words">
                    <a className="mr-4 p-6">Your Last Words</a>
                </Link>
            </div>
            <ConnectButton moralisAuth={false} />
        </nav>
    )
}
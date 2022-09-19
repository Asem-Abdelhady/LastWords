import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { Nav, Navbar, Container } from "react-bootstrap"

export default function Header() {
    return (
        <Navbar className="p-3 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-3 px-3 font-bold text-2xl">Last Words Gallery</h1>
            <Navbar.Collapse id="responsive-navbar-nav"></Navbar.Collapse>

            <Nav className="me-auto">
                <Link href="/">
                    <a className="mr-4 p-6 text-decoration-none">Home</a>
                </Link>
                <Link href="/your-last-words">
                    <a className="mr-4 p-6 text-decoration-none">Your Last Words</a>
                </Link>
            </Nav>

            <Nav>
                <ConnectButton moralisAuth={false} />
            </Nav>
        </Navbar>
    )
}

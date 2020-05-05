import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link';
import { navLinks } from '../lib/utils';

export default function NavigationBar({authenticated, sfOrgUrl}) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Matt Grimwade</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                {navLinks.map((navLink, index) =>   <Link key={index} href={navLink.url} >
                                                        <Nav.Link href="#dummy">{navLink.label}</Nav.Link>
                                                    </Link>)}
            </Nav>
            {authenticated && <Navbar.Text>Signed in to: {sfOrgUrl}</Navbar.Text>}
            </Navbar.Collapse>
        </Navbar>
    )
}

export async function getServerSideProps({req}) {
    const { session } = req;
    const authenticated = false;
    if (session && session.accessToken && session.instanceUrl)
    {
        authenticated = true;
    }

    return {
        props : {
            authenticated : authenticated,
            sfOrgUrl : session.instanceUrl
        }
    }
}
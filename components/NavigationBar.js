import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Link from 'next/link';

export default function NavigationBar({authenticated, sfOrgUrl}) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Matt Grimwade</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link href="/index" >
                    <Nav.Link href="#dummy">Home</Nav.Link>
                </Link>
                <Link href="/projects/home" >
                    <Nav.Link href="#dummy">Projects</Nav.Link>
                </Link>
                {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
            </Nav>
            <AuthenticatedText authenticated={authenticated} url={sfOrgUrl}/>
            </Navbar.Collapse>
        </Navbar>
    )
}

function AuthenticatedText(props) {
    if (props.authenticated) {
        return (
            <Navbar.Text>
                Signed in to: {props.url}
            </Navbar.Text>
        )
    }

    return null;
}

export async function getServerSideProps(context) {
    console.log('navbar');
    console.log('navbar sessionId ' + context.req.sessionId);
    console.log('navbar sessionId ' + context.req.sessionId);

    const authenticated = false;
    if (context.req.session && context.req.session.accessToken && context.req.session.instanceUrl)
    {
        authenticated = true;
    }
    console.log('navbar authenticated ' + authenticated);

    return {
        props : {
            authenticated : authenticated,
            sfOrgUrl : context.req.session.instanceUrl
        }
    }
}
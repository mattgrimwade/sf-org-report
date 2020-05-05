import Head from 'next/head';
import Layout from '../../components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Router from 'next/router'

export default function Home() {

    const launchOrgReport = () => {Router.push('/projects/org-report/')};

    return (
        <Layout>
            <Head>
                <title>Projects</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Row>
                <Col><h2>Salesforce Org Report</h2></Col>
            </Row>
            <Row>
                <Col><p>Generate a report of the various metadata components in your Salesforce Org.</p></Col>
            </Row>
            <Row>
                <Col><Button variant="primary" onClick={launchOrgReport}>Launch</Button></Col>
            </Row>
        </Layout>
    );
}
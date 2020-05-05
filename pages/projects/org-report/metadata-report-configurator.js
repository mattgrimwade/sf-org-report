import Head from 'next/head';
import Layout from '../../../components/Layout';
import MetadataSelector from '../../../components/MetadataSelector'
import MetadataTable from '../../../components/MetadataTable'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { metadataTypes, reportColumnHeadersByType, buildReportRowForType } from '../../../lib/metadata-params';

export default class OrgReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metadataTypesForRetrieval : 
                metadataTypes.map((metadataType) => {return {type: metadataType, folder: null, records: []}}),
            showReport : false
        };

        this.selectedRecordsByType =  {}
    }

    /*
        Call the server to retrieve our metadata. Easier to use jsforce on the server as without CORS in the org
        we would have to use our server as a proxy anyway.
    */
    fetchMetadata = async (metadata) => {
        try {
            const response = await fetch('/api/query-metadata', {
                method: 'post',
                body : JSON.stringify({type: metadata.type})
            });
            const result = await response.json();
            
            this.handleMetadataNameRetrieval(JSON.parse(result.records), metadata.type);
        } catch (e) {
            console.error(e);
        }
    }

    selectRecordsForType = async (type,records) => {
        this.selectedRecordsByType[type] = records;
    }

    handleMetadataNameRetrieval = (metadata, metadataType) => {
        if (metadata)
        {
            const metadataStore = this.state.metadataTypesForRetrieval.find((element => element.type === metadataType));
            metadataStore.records = [];
            metadata.records.forEach((record) => {
                metadataStore.records.push(record);
            });

            this.setState({
                metadataTypesForRetrieval : this.state.metadataTypesForRetrieval
            });
        }
    }

    generateReport = () => {
        localStorage.setItem('selectedRecords', JSON.stringify(this.selectedRecordsByType));
        this.setState({ selectedRecordsByType: this.selectedRecordsByType,
                        showReport : true
        });
    }

    /*
        Load the previous selections from local storage - obviously need to do client side
    */
    componentDidMount() {
        this.selectedRecordsByType = localStorage.getItem('selectedRecords') ? JSON.parse(localStorage.getItem('selectedRecords')) : {};
    }

    getMetadataConfigurator() {
        const { metadataTypesForRetrieval } = this.state;
        return (<Col>
                    {metadataTypesForRetrieval.map((metadata, index) => <MetadataSelector metadata={metadata} fetchMetadata={this.fetchMetadata}
                                                                                            selectRecordsForType={this.selectRecordsForType} key={index} />)}
                    <Row className="mt-1"><Col><Button variant="primary" onClick={this.generateReport}>Generate Report</Button></Col></Row>
                </Col>)
    }

    getMetadataReport() {
        const metadataTypes = Object.keys(this.state.selectedRecordsByType);
        return (
            <>
                <Col>
                    {metadataTypes.map( (metadataType, index) => {
                        const columns = reportColumnHeadersByType[metadataType];
                        const rows = this.state.selectedRecordsByType[metadataType].map(record => buildReportRowForType(metadataType, record));

                        const props = {rows, columns, key: index, selector: false};
                        return rows && rows.length > 0 ? <MetadataTable {...props} /> : null;
                    })}
                </Col>
                <Row className="mt-2"><Col><Button variant="primary" onClick={this.hideReport}>Back</Button></Col></Row>
            </>
        );
    }

    hideReport = () => this.setState({showReport: false});

    //todo..
    logoutFromOrg = () => {

    }
    
    render() {
        const { instanceUrl } = this.props;
        const content = this.state.showReport ? this.getMetadataReport() : this.getMetadataConfigurator(); 

        return (
            <Layout>
                <Head>
                    <title>Org Report</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Container>
                    <Row className="mt-2">
                        <Col>
                            <h2>Authenticated at {instanceUrl}</h2>
                        </Col>
                        <Col md="auto">
                            <Button variant="primary" onClick={this.logoutFromOrg}>Logout</Button>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    {content}
                </Container>
            </Layout>
        );
    }
}

export async function getServerSideProps(context) {
    if (context.req.session.instanceUrl == null) {
        context.res.redirect('/index');
    }
    const props = { instanceUrl : context.req.session.instanceUrl};

    return {
        props: props
    };
}
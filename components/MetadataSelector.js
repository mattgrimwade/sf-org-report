import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import styles from './MetadataSelector.module.css';
import MetadataTable from './MetadataTable';
import { selectorColumnHeadersByType, buildSelectorRowForType, getSelectedRecords } from '../lib/metadata-params';

export default class MetadataSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded : false,
            loading : false,
            loadedRecords : false,
            tableProps : this.buildTableProps()
        }
        this.selectedIds = [];
    }

    async fetchMetadata() {
        await this.props.fetchMetadata(this.props.metadata)
        this.setState({
            loading: false,
            loadedRecords: true,
            tableProps: this.buildTableProps()
        });
    }

    toggleMetadata = (event) => {
        if (this.state.loadedRecords)
        {
            this.setState({expanded: !this.state.expanded});
        }
        else {
            this.setState({expanded: !this.state.expanded, loading: true});
            this.fetchMetadata();
        }
    }

    getSelectedRecordsFromLocalStorage(type) {
        return localStorage.getItem('selectedRecords') ? JSON.parse(localStorage.getItem('selectedRecords'))[type] : {};
    }

    buildTableProps() {
        const { records, type } = this.props.metadata; 
        const tableProps = {
            columns: selectorColumnHeadersByType[type],
            selector : true,
            key : type,
            type : type,
            setParentSelectedRows : async selectedIds => {
                this.selectedIds = selectedIds
                const selectedRecords = []; 
                records.forEach(record => {
                    if (selectedIds[record.Id]) {
                        selectedRecords.push(record);
                    }
                }) 
                //send up to the main parent component
                this.props.selectRecordsForType(type, selectedRecords);
            }
    
        };
        tableProps.rows = records.map(record => buildSelectorRowForType.call(tableProps, record));

        return tableProps;
    }

    render() {
        const { expanded, loading, loadedRecords, tableProps } = this.state;
        const { type } = this.props.metadata;

        return (
            <Row className={`${styles.parent} border my-2 p-1`}>
                <Container>
                    <Col>
                        <Row disabled={loading} onClick={this.toggleMetadata}>  
                        <i className={`fa fa-caret-right mt-1 mr-1 ${expanded ? 'd-none' : ''}`} aria-hidden="true"></i>
                        <i className={`fa fa-caret-down mt-1 mr-1 ${expanded ? '' : 'd-none'}`} aria-hidden="true"></i>
                                {type}
                        <Spinner className={`${styles.spinner} mt-1 ml-1`} data-loading={loading} animation="border" role="status" size="sm">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        
                        </Row>
                        <Col className={`${(expanded && loadedRecords) ? '' : 'd-none'}`}>
                            <MetadataTable {...tableProps} previouslySelectedIds={() => getSelectedRecords(this.getSelectedRecordsFromLocalStorage(type), tableProps.rows)} />
                        </Col>
                    </Col>
                </Container>
            </Row>
        );
    }
}


import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import styles from './MetadataSelector.module.css';
import MetadataTable from './MetadataTable';
import { selectorColumnHeadersByType, buildSelectorRowForType } from '../lib/metadata-params';

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

    showIfExpanded() {
        return this.state.expanded ? '' : 'd-none';
    }

    showIfLoaded() {
        return this.state.loadedRecords ? '' : 'd-none';
    }

    showIfCollapsed() {
        return this.state.expanded ? 'd-none' : '';
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
        const { type } = this.props.metadata; 
        const tableProps = {
            columns: selectorColumnHeadersByType[type],
            previouslySelectedIds : {},
            selector : true,
            key : type,
            type : type,
            setParentSelectedRows : async selectedIds => {
                this.selectedIds = selectedIds
                const selectedRecords = []; 
                this.props.metadata.records.forEach(record => {
                    if (record.Id in selectedIds) {
                        selectedRecords.push(record);
                    }
                }) 
                //send up to the main parent component
                this.props.selectRecordsForType(type, selectedRecords);
            }
    
        };
        tableProps.rows = this.props.metadata.records.map(record => buildSelectorRowForType.call(tableProps, record, this.getSelectedRecordsFromLocalStorage(type)));

        return tableProps;
    }

    render() {
        return (
            <Row className={`${styles.parent} border my-2 p-1`}>
                <Container>
                    <Col>
                        <Row disabled={this.state.loading} onClick={this.toggleMetadata}>  
                        <i className={`fa fa-caret-right mt-1 mr-1 ${this.showIfCollapsed()}`} aria-hidden="true"></i>
                        <i className={`fa fa-caret-down mt-1 mr-1 ${this.showIfExpanded()}`} aria-hidden="true"></i>
                                {this.props.metadata.type}
                        <Spinner className={`${styles.spinner} mt-1 ml-1`} data-loading={this.state.loading} animation="border" role="status" size="sm">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        
                        </Row>
                        <Col className={`${this.showIfExpanded()} ${this.showIfLoaded()}`}>
                            <MetadataTable {...this.state.tableProps} />
                        </Col>
                    </Col>
                </Container>
            </Row>
        );
    }
}


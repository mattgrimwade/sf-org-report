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
            allSelected : false,
            tableProps : this.buildTableProps()
        }
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
        if (this.state.loadedRecords) {
            this.setState({expanded: !this.state.expanded});
        }
        else {
            this.setState({expanded: !this.state.expanded, loading: true});
            this.fetchMetadata();
        }
    }

    async setParentSelectedRows(selectedIds) {
        const { type } = this.props.metadata;
        this.selectedIds = selectedIds
        this.props.setSelectedIdsForType(type, selectedIds);
    }

    getSelectedIds = (type) => {
        //think really should hold in state whether we've retrieved from local storage yet
        if (!this.selectedIds || Object.keys(this.selectedIds).length === 0) {
            this.selectedIds = this.props.getSelectedIdsForType(type);
        }

        return this.selectedIds;
    }

    buildTableProps() {
        const { records, type } = this.props.metadata; 
        const tableProps = {
            columns: selectorColumnHeadersByType[type],
            selector : true,
            key : type,
            type : type,
            allSelected : false,
            selectRow : (rowId) => {
                this.selectedIds[rowId] = !this.selectedIds[rowId];
                this.setParentSelectedRows(this.selectedIds);    
            },
            selectAllRows : () => {
                tableProps.rows.forEach(row => {
                    this.selectedIds[row.Id] = !this.state.allSelected;
                });
                this.setParentSelectedRows(this.selectedIds);
                this.setState({allSelected : !this.state.allSelected});
            }
        };
        
        tableProps.rows = records.map(record => buildSelectorRowForType.call(tableProps, record));

        return tableProps;
    }

    render() {
        const { expanded, loading, loadedRecords, tableProps, allSelected } = this.state;
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
                            <MetadataTable {...tableProps} allSelected={allSelected} getSelectedIds={this.getSelectedIds} />
                        </Col>
                    </Col>
                </Container>
            </Row>
        );
    }
}


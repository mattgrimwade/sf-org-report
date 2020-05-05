
import styles from './MetadataTable.module.css';
/*
    Deliberately chose functional components for the table rather than classes so that I could learn hooks & state
    management.
*/
function MetadataTable({columns, rows, selector, setParentSelectedRows, previouslySelectedIds, type}) {
    const [showSelector, setStateShowSelector] = React.useState(selector);
    const [selectedIds, setStateSelectedIds] = React.useState({});
    const [allSelected, setStateAllSelected] = React.useState(false);
    const [indeterminateSelectAll, setStateIndeterminateSelectAll] = React.useState(false);
    const selectAllCheckboxRef = React.useRef(null);

    const state = { showSelector, setStateShowSelector, 
                    selectedIds, setStateSelectedIds, 
                    allSelected, setStateAllSelected, 
                    indeterminateSelectAll, setStateIndeterminateSelectAll, 
                    selectAllCheckboxRef,
                    setParentSelectedRows,
                    rows, columns
    }

    //checkbox onChange handler functions
    const updateSelected = (rowKey) => updateSelectedRow(rowKey, state);
    const selectAll = () => selectAllRows(state);

    React.useEffect(() => {
        if (showSelector) selectAllCheckboxRef.current.indeterminate = indeterminateSelectAll;
    },[indeterminateSelectAll]);

    //we need to set the previously selected Ids here as they are stored client side in local storage - so on first component load on
    //the server there won't be any (useState(initial) only sets on first run execution)
    React.useEffect(() => {
        setStateSelectedIds(previouslySelectedIds);
    },[previouslySelectedIds]);

    return (
        <table className={`${styles.parent} mt-5 w-100`}>
            <thead>
                <tr>
                    {showSelector && <th><input ref={selectAllCheckboxRef} onChange={() => selectAll()} type="checkbox" value={true} 
                                                id={`checkBoxAll_${type}`} className="mx-auto"/><label for={`checkBoxAll_${type}`} /></th>}

                    {columns.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => <DataRow key={index} type={type} rowIndex={index} 
                                                    updateSelection={updateSelected} showSelector={showSelector} {...row}/>)}
            </tbody>
        </table>
    );
}

function DataRow({updateSelection, defaultSelected, selected, cells, rowIndex, showSelector, type}) {
    if (selected == null) {
        selected = defaultSelected;
    }
    return (
        <tr className="py-3">     
            {showSelector && <td><input onChange={() => updateSelection(rowIndex)} checked={selected} value={selected} type="checkbox" id={`checkBox_${rowIndex}_${type}`}/>
                                <label for={`checkBox_${rowIndex}_${type}`} /></td>}
            
            {cells.map(cellData => <DataCell {...cellData}/> )}
        </tr>
    );
}

function DataCell({value}) {
    return <td>{value}</td>
}

function updateSelectedRow(rowKey, {rows, selectedIds, allSelected, indeterminateSelectAll, 
                                    setStateIndeterminateSelectAll, setStateSelectedIds, setParentSelectedRows}) {
    console.log('rowKey ', rowKey);
    const row = rows[rowKey]
    const subjectId = row.id;

    if (selectedIds[subjectId]) {
        delete selectedIds[subjectId];
    } else {
        selectedIds[subjectId] = true;
    }
    const currentSelected = row.selected != null ? row.selected : row.defaultSelected;
    rows[rowKey].selected = !currentSelected;
    
    
    if (allSelected === true && indeterminateSelectAll === false) {
        setStateIndeterminateSelectAll(true);
    }
    //need to create a new object for this as useState does not detect object changes 
    setStateSelectedIds(Object.assign({}, selectedIds));
    setParentSelectedRows(selectedIds);
}

function selectAllRows({allSelected, rows, selectedIds, setStateIndeterminateSelectAll, 
                            setStateSelectedIds, setStateAllSelected, setParentSelectedRows}) {
    //if it was false then we are now selecting all
    if (allSelected === false) {
        rows.forEach(row => {
            row.selected = true;
            selectedIds[row.id] = true;
        })
    } else {
        rows.forEach(row => {
            row.selected = false;
            delete selectedIds[row.id];
        })
    }
    setStateIndeterminateSelectAll(false);
    setStateSelectedIds(selectedIds);
    setParentSelectedRows(selectedIds);    
    setStateAllSelected(!allSelected);
}

export default MetadataTable;


import styles from './MetadataTable.module.css';

function MetadataTable({columns, rows, selector, setParentSelectedRows, previouslySelectedIds, type}) {
    const [showSelector, setShowSelector] = React.useState(selector);
    const [selectedIds, setSelectedIds] = React.useState({});
    const [allSelected, setAllSelected] = React.useState(false);
    const [indeterminateSelectAll, setIndeterminateSelectAll] = React.useState(false);
    const selectAllCheckboxRef = React.useRef(null);

    const updateSelected = (rowKey) => {
        const row = rows[rowKey]
        const subjectId = row.id;
    
        if (selectedIds[subjectId]) 
            delete selectedIds[subjectId]; 
        else 
            selectedIds[subjectId] = true;
        
        const currentSelected = row.selected == null ? row.defaultSelected : row.selected;
        rows[rowKey].selected = !currentSelected;
        
        if (allSelected && indeterminateSelectAll === false) setIndeterminateSelectAll(true);

        setSelectedIds(Object.assign({}, selectedIds));
        setParentSelectedRows(selectedIds);    
    }

    const selectAll = () => {
        rows.forEach(row => {
            row.selected = !allSelected; 
            if (allSelected) 
                deleteSelectedIds[row.id]; 
            else 
                selectedIds[row.id] = true;
        });

        setIndeterminateSelectAll(false);
        setSelectedIds(selectedIds);
        setParentSelectedRows(selectedIds);    
        setAllSelected(!allSelected);    
    }

    React.useEffect(() => {
        if (showSelector) selectAllCheckboxRef.current.indeterminate = indeterminateSelectAll;
    },[indeterminateSelectAll]);

    React.useEffect(() => {
        setSelectedIds(previouslySelectedIds);
    },[previouslySelectedIds]);

    return (
        <table className={`${styles.parent} mt-5 w-100`}>
            <thead>
                <tr>
                    {showSelector && (
                        <th><input ref={selectAllCheckboxRef} 
                                                onChange={selectAll} 
                                                type="checkbox" 
                                                value={true} 
                                                id={`checkBoxAll_${type}`} 
                                                className="mx-auto"/>
                                            <label for={`checkBoxAll_${type}`} />
                        </th>
                    )}
                    {columns.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => 
                    <tr key={index} className="py-3">     
                        {showSelector && (
                            <td><input onChange={() => updateSelected(index)} 
                                                    checked={row.selected == null ? row.defaultSelected : row.selected}
                                                    value={row.defaultSelected} 
                                                    type="checkbox" 
                                                    id={`checkBox_${index}_${type}`}/>
                                <label for={`checkBox_${index}_${type}`} />
                            </td>
                        )}
                        {cells.map(cellData => (
                            <td>{cellData.value}</td>
                        ))}
                    </tr>
                )}                
            </tbody>
        </table>
    );
}

export default MetadataTable;

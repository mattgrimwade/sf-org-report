
import styles from './MetadataTable.module.css';

function MetadataTable({columns, rows, selector, setParentSelectedRows, previouslySelectedIds, type}) {
    const [selectedIds, setSelectedIds] = React.useState({});
    const [allSelected, setAllSelected] = React.useState(false);
    const selectAllCheckboxRef = React.useRef(null);

    const updateSelected = (rowKey) => {
        const row = rows[rowKey]
        selectedIds[row.id] = !selectedIds[row.id]

        setSelectedIds(Object.assign({}, selectedIds));
        setParentSelectedRows(selectedIds);    
    }

    const selectAll = () => {
        rows.forEach(row => {
            row.selected = !allSelected; 
            selectedIds[row.id] = !allSelected;
        });

        setSelectedIds(selectedIds);
        setParentSelectedRows(selectedIds);    
        setAllSelected(!allSelected);    
    }

    React.useEffect(() => {
        setSelectedIds(previouslySelectedIds);
    },[previouslySelectedIds]);

    return (
        <table className={`${styles.parent} mt-5 w-100`}>
            <thead>
                <tr>
                    {selector && (
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
                        {selector && (
                            <td><input onChange={() => updateSelected(index)} 
                                                    checked={selectedIds[row.id]}
                                                    value={row.defaultSelected} 
                                                    type="checkbox" 
                                                    id={`checkBox_${index}_${type}`}/>
                                <label for={`checkBox_${index}_${type}`} />
                            </td>
                        )}
                        {cells.map(cell => (
                            <td>{cell.value}</td>
                        ))}
                    </tr>
                )}                
            </tbody>
        </table>
    );
}

export default MetadataTable;

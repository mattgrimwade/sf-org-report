
import styles from './MetadataTable.module.css';

function MetadataTable({columns, rows, selector, getSelectedIds,
                        type, selectRow, selectAllRows}) {
    const selectedIds = (getSelectedIds) ? getSelectedIds(type) : {};
    return (
        <table className={`${styles.parent} mt-5 w-100`}>
            <thead>
                <tr>
                    {selector && (
                        <th><input  onChange={selectAllRows} 
                                    type="checkbox" 
                                    value={true} 
                                    id={`checkBoxAll_${type}`} 
                                    className="mx-auto"/>
                            <label htmlFor={`checkBoxAll_${type}`} />
                        </th>
                    )}
                    {columns.map(header => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => 
                    <tr key={index} className="py-3">     
                        {selector && (
                            <td><input  onChange={() => selectRow(row.Id)} 
                                        checked={selectedIds && selectedIds[row.Id]}
                                        value={row.defaultSelected} 
                                        type="checkbox" 
                                        id={`checkBox_${index}_${type}`}/>
                                <label htmlFor={`checkBox_${index}_${type}`} />
                            </td>
                        )}
                        {row.cells.map(cell => {
                            console.log('cell ', cell);
                            return (
                            <td key={cell.key} >{cell.value}</td>
                        )})}
                    </tr>
                )}                
            </tbody>
        </table>
    );
}

export default MetadataTable;

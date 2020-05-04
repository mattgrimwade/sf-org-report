import React from 'react';

class DataTable extends React.Component {
	constructor(props) {
		super(props);
		this.columns = props.columns;
		this.rows = props.rows;
	}

	renderRow(row) {
		return (
			<DataRow rowData={row}/>
		);
	}

	renderHeader(header)
	{ 
		return (<th>{header}</th>)
	}

	render() {
		return (
			<table>
				<thead>
					{this.columns.map(header => {return this.renderHeader(header)})}
				</thead>
				<tbody>
					{this.rows.map(row => {return this.renderRow(row)})}
				</tbody>
			</table>
		);
	}
}

class DataRow extends React.Component {
	render() {
		return (
			<tr>
				{this.props.rowData.map(cellData => {
						return (
							<DataCell value={cellData}/>
						);
					})}
			</tr>
		);
	}
}

class DataCell extends React.Component {
	render() {
		return (
			<td>{this.props.value}</td>
		);
	}

}

export default props => {
	return <DataTable columns={props.columns} rows={props.rows}/>;
}
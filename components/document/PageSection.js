import React from 'react';
import Table from './PageTable';

class PageSection extends React.Component {
    
    sectionData;

    constructor(props) 
    {
        super(props);
        this.sectionData = props.sectionData;
    }

    buildSection(section)
    {
        if (section.type == 'header1')
        {
            return (<h1>{section.value}</h1>)
        }
        else if (section.type == 'text')
        {
            return (section.value.map(para => {return <p>{para}</p>}));
        }
        else if (section.type == 'table')
        {
            return (<Table columns={section.value.columns} rows={section.value.rows} />)
        }
    }
     
    render()
    {
        return (
            <section>
                {this.sectionData.map(section => this.buildSection(section))}
            </section>
        )
    }
}

export default props => {
    return <PageSection sectionData={props.sectionData} />  
}
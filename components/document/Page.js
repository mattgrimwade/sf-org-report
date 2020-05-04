import React from 'react';
import PageSection from './PageSection';

class Page extends React.Component
{
    title = 'Test';
    sections = []

    constructor(props) {
        super(props);
        this.title = props.pageData.title; 
        this.sections = props.pageData.sections
    }  

    renderSection(section) {
        return <PageSection sectionData={section} />
    }

	render() {
		return (
			<div>
				<title>{this.title}</title>
				<h1>{this.title}</h1>
				{this.sections.map(section => {return this.renderSection(section);})};
			</div>
		);
	}
}

export default props => {
    return <Page pageData={props.pageData}/>;
};

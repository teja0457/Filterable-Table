import React from 'react';
import ReactDOM from 'react-dom';
import TableComponent from './TableComponent';

export default class Main extends React.Component{
	constructor(props){
    	super(props);
    	this.state={table_data:[]};
  	}
	componentWillMount(){
	    fetch("https://swapi.co/api/starships/").then((response)=>{
	      if(response.ok){
	       return  response.json().then((json)=>{
	          this.setState({table_data:json.results});
	        })

	      }else{
	        console.log("Error status : ",response.status);
	        console.log("Error status text: ",response.statusText);
	        throw Error("Error occured while fetching data");
	      }
	    })
  	}
	render(){
		return (<div>
					<div className="table_heading">Filterable Table</div>
					{this.state.table_data.length !==0 &&
						<div><TableComponent data={this.state.table_data} /></div>
					}
				</div>);
	}
}
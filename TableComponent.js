import React from 'react';
import ReactDOM from 'react-dom';

export default class TableComponent extends React.Component{
	constructor(props){
	    super(props);
	    this.state={
	      table_data:this.props.data,
	      dummy_data:this.props.data,
	      open_filter:false,
	      selected_column:"name"
	    }
	    this.closeFilter=this.closeFilter.bind(this);
	}
	sortTable(key,event){
    let data= this.state.table_data,
        sorted_data=[],
        target=event.target.classList.contains('cell')? event.target :event.target.parentElement,
        sort_type="asc";
    sorted_data= data.sort(function (a, b) {
							// a and b will be two instances of your object from your list
							// possible return values
							var a1st = -1; // negative value means left item should appear first
							var b1st =  1; // positive value means right item should appear first
							var equal = 0; // zero means objects are equal

							// compare your object's property values and determine their order
                          	let x= !isNaN(a[key])? a[key] : 0,
                          		y= !isNaN(b[key]) ? b[key] : 0;
                              if (!isNaN(a[key]) || !isNaN(b[key])) {
                                return x-y;
                              }else{
                                if (b[key] < a[key]) {
                                  return b1st;
                                }
                                else if (a[key] < b[key]) {
                                    return a1st;
                                }
                                else {
                                    return equal;
                                }
                              }                                      
                          });
    if (!this.state.sort_type || this.state.sort_type==="desc" || (this.state.sort_key&&this.state.sort_key !== key)) {
    	if (document.getElementsByClassName('desc')[0]) {
    		document.getElementsByClassName('desc')[0].classList.remove('desc');
    	}
      	sort_type="asc";
    }else{
		sort_type="desc";
		sorted_data.reverse();
		if (document.getElementsByClassName('asc')[0]) {
    		document.getElementsByClassName('asc')[0].classList.remove('asc');
    	}
    }
    target.lastElementChild.classList.add(sort_type);
    this.setState({sort_type,sort_key:key,table_data:sorted_data});
  }
  createTableEle(data){
    let tableObj={},
        row_eles=[],
        header_cells=[],
        header_row=[],
        filter_list=[],
        header_keys=Object.keys(data[0]);
    data.forEach((obj,ind)=>{
      let cells=[];
      header_keys.forEach((key,keyInd)=>{
        if (ind===0) {
          header_cells.push(<div className="cell" key={key} onClick={this.sortTable.bind(this,key)}><label>{key.toUpperCase()}</label><span></span></div>);
          filter_list.push(<div className="filter_cell" key={"filter"+key} onClick={this.selectFilterColumn.bind(this,key)}>{key.toUpperCase()}</div>);
        }
        cells.push(<div key={'cells'+ind+keyInd} className="cell"><label>{obj[key]}</label></div>);
      })
      row_eles.push(<div key={'row'+ind} className="table_row">{cells}</div>);
    })
    header_row.push(<div key="header_row" className="table_row">{header_cells}</div>);
    tableObj.header=data.length > 0 ? header_row: [];
    tableObj.body=data.length > 0 ? row_eles : [];
    tableObj.filter_list=filter_list;
    return tableObj;
  }
  openFilter(){
    this.setState({open_filter:true});
    document.addEventListener("click", this.closeFilter);
  }
  closeFilter(){
   	this.setState({open_filter:false});
    document.removeEventListener("click", this.closeFilter); 
  }
  selectFilterColumn(key){
    this.setState({selected_column:key});
  }
  filterData(){
    let search_text=document.getElementById('search_field').value,
        {dummy_data,selected_column}=this.state,
        filtered_data=[];
    dummy_data.forEach((obj,ind)=>{
      if (obj[selected_column].toString().includes(search_text)) {
        filtered_data.push(obj);
      }
    })
    this.setState({table_data:filtered_data});
  }
	render(){
		//
    	let table_ele=this.props.data.length !== 0 ? this.createTableEle(this.state.table_data) : {};

		return (<section className="">
		            <div className="dropdown_container">
						<div className="dropdown_label">Choose Column To Filter : </div>
						<div className="dropdown" onClick={this.openFilter.bind(this)}>{this.state.selected_column.toUpperCase()}</div>
						{this.state.open_filter&&
							<div className="filter_list_container">{table_ele.filter_list}</div>
						}
		            </div>
					<div className="search_container">
						<div>
							<input type="text" placeholder="Enter Filter/Search string" name="search_field" className="search_field" id="search_field"/>
							<button onClick={this.filterData.bind(this)}>Filter/Search</button>
						</div>
					</div>
			        <div className="table_container">
			          <table>
			            <thead>{table_ele.header}</thead>
			            <tbody>{table_ele.body}</tbody>
			          </table>
			        </div>
		        </section>);
	}
}
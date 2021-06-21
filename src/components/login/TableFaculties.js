import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import axios from 'axios';

class TableFaculties extends Component {
  state = {
    faculties: [],
    columns: [{
      dataField: 'id',
      text: 'Faculty ID',
      sort: true
    },
    {
      dataField: 'name',
      text: 'Faculty Name',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'shortName',
      text: 'Abbreviation',
      sort: true
    },
    {
      dataField: 'description',
      text: 'Faculty description',
      sort: true
    },
    {
      dataField: 'url',
      text: 'Faculty webpage',
      sort: true
    }]
  }
  

  componentDidMount() {
    this.updateFaculties();
  }

  updateFaculties() {
    axios.get('http://localhost:8080/faculties/')
    .then(response => {
      this.setState({
        faculties: response.data
      });
    });
  }
  
  render() {

    var cellEditNew = cellEditFactory({
      mode: 'click',
      afterSaveCell: (oldValue, newValue, row, column) => {
        console.log(row)
        axios.put('http://localhost:8080/faculties/' + row.id, row ).then(response => {
          console.log(response.data)
          this.updateFaculties();
       })
      }
    });

    return (
      <div className="container" style={{ marginTop: 50 }}>
        <BootstrapTable
        striped
        hover
        selectRow={ { mode: 'checkbox' } }
        keyField='id' 
        data={ this.state.faculties } 
        columns={ this.state.columns }
        filter={ filterFactory() } 
        pagination={ paginationFactory() }
        cellEdit={ cellEditNew }
        >

        </BootstrapTable>
      </div>
    );
  }
}

export default TableFaculties;
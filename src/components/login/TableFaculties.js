import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import axios from 'axios';

const URL = 'https://wat-map-database.herokuapp.com';
//const URL = 'http://localhost:8080';

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
    },
    {
      dataField: "remove",
      text: "Delete",
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => this.handleDelete(row.id, row.name)}
          >
            Delete
          </button>
        );
      },
    }]
  }

  handleDelete = (rowId, name) => {
    console.log(rowId);
    axios.delete(URL + '/faculties/' + rowId)
    .then(response => {
      console.log(response.data)
      this.updateFaculties()
    });
  };

  componentDidMount() {
    this.updateFaculties();
  }

  updateFaculties() {
    axios.get(URL + '/faculties/')
    .then(response => {
      this.setState({
        faculties: response.data
      });
    });
  }


  onClick(e) {
    var newFacy=
      {
        "description": "",
        "id": 0,
        "institutes": [],
        "name": "NEW",
        "shortName": "NEW" + (this.state.faculties.length+1),
        "url": "NEW"
      }

      console.log(newFacy)

      axios.post(URL + '/faculties/', newFacy)
      .then(response => {
        console.log(response.data)
        this.state.faculties.push(response.data)
        this.updateFaculties()
      });
  }

  

  render() {

    var cellEditNew = cellEditFactory({
      mode: 'click',
      afterSaveCell: (oldValue, newValue, row, column) => {
        console.log(row)
        console.log(oldValue)
        console.log(newValue)
        console.log(column)
        axios.put(URL + '/faculties/' + row.id, row ).then(response => {
          console.log(response.data)
          this.updateFaculties();
       })
      }
    });

    return (
      <div className="container" style={{ marginTop: 50 }}>
          <div className="d-flex justify-content-around p-2">
            <button
              className="btn bg-success text-light rounded"
              onClick={
                this.onClick.bind(this)
              }>
                Add row
            </button>
          </div>

        <BootstrapTable
        striped
        hover
        keyField={'id'} 
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
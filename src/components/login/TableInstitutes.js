import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import axios from 'axios';

const URL = 'https://wat-map-database.herokuapp.com';
//const URL = 'http://localhost:8080';

class TableInstitutes extends Component {
  state = {
    institutes: [],
    columns: [{
      dataField: 'id',
      text: 'Institute ID',
      sort: true
    },
    {
      dataField: 'name',
      text: 'Institute Name',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'description',
      text: 'description',
      sort: true
    },
    {
      dataField: 'latitude',
      text: 'latitude',
      sort: true
    },
    {
      dataField: 'longitude',
      text: 'longitude',
      sort: true
    },
    {
      dataField: 'facultyId',
      text: 'faculty ID',
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
    axios.delete(URL + '/institutes/' + rowId)
    .then(response => {
      console.log(response.data)
      this.updateInstitutes()
    });
  };

  componentDidMount() {
    this.updateInstitutes();
  }

  updateInstitutes() {
    axios.get(URL + '/institutes/')
    .then(response => {
      this.setState({
        institutes: response.data
      });
    });
  }


  onClick(e) {
    var newIns=
      {
        "id": 0,
        "name": "NEW",
        "description": "NEW",
        "number": 1,
        "latitude": 0.0,
        "longitude": 0.0,
        "facultyId": 3
      }

      console.log(newIns)

      axios.post(URL + '/institutes/', newIns)
      .then(response => {
        console.log('Response')
        console.log(response.data)
        this.state.institutes.push(response.data)
        this.updateInstitutes()
      });
  }

  

  render() {

    var cellEditNew = cellEditFactory({
      mode: 'click',
      afterSaveCell: (oldValue, newValue, row, column) => {
        console.log(column)
        axios.put(URL + '/institutes/' + row.id, row ).then(response => {
          console.log(response.data)
          this.updateInstitutes();
       })
       
        if (column.dataField === "facultyId") {
          console.log(URL + '/faculties/' + row.facultyId + '/institutes/' + row.id + '/add')
          axios.post(URL + '/faculties/' + row.facultyId + '/institutes/' + row.id + '/add').then(response => {
            console.log(response.data)
            this.updateInstitutes();
         })
        }
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
        data={ this.state.institutes } 
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

export default TableInstitutes;
import React, { Component } from "react";
import { Row, FormGroup, FormControl, Button, HelpBlock } from 'react-bootstrap';
import {isEmpty, isLength, isContainWhiteSpace } from './validator';
import './login.css'
import TableFaculties from './TableFaculties'
import axios from 'axios';

class Login extends Component {

    componentDidMount(){
        document.body.style.background = "royalblue"
        document.body.style.backgroundImage = "url('background.PNG')"
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundAttachment = "fixed"
        document.body.style.backgroundSize = "cover"

    }

    constructor(props) {
        super(props)

        this.state = {
            formData: {}, // Contains login form data
            errors: {}, // Contains login field errors
            formSubmitted: false, // Indicates submit status of login form
            loading: false, // Indicates in progress state of login form
            logged: false
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let { formData } = this.state;
        formData[name] = value;

        this.setState({
            formData: formData
        });
    }

    validateLoginForm = (e) => {

        let errors = {};
        const { formData } = this.state;

        if (isEmpty(formData.login)) {
            errors.login = "Login can't be blank";
        }

        if (isEmpty(formData.password)) {
            errors.password = "Password can't be blank";
        }  else if (isContainWhiteSpace(formData.password)) {
            errors.password = "Password should not contain white spaces";
        } else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
            errors.password = "Password's length must between 6 to 16";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    }

    login = (e) => {

        e.preventDefault();
        const { formData } = this.state;

        let errors = this.validateLoginForm();

        if(errors === true) {
            axios.post('https://wat-map-database.herokuapp.com/admin/', {'login' : formData.login, 'password' : formData.password}).then(resp => {
                if (resp.status === 200) {
                    this.setState({
                        errors: errors,
                        formSubmitted: true,
                        logged: true
                    });
                } else {
                    alert("wrong password!")
                }
            })
        } else {
            this.setState({
                errors: errors,
                formSubmitted: true,
                logged: false
            });
        }
    }

    render() {


        if(!this.state.logged)
        {
            const { errors, formSubmitted } = this.state;

            return (
                <div className="Login">
                    <Row>
                        <form onSubmit={this.login}>
                            <h1 className="title">Login</h1>
                            <FormGroup controlId="login" className="input" validationState={ formSubmitted ? (errors.login ? 'error' : 'success') : null }>
                                <FormControl type="text" name="login" placeholder="Enter your login" onChange={this.handleInputChange} />
                            { errors.login &&
                                <HelpBlock>{errors.login}</HelpBlock>
                            }
                            </FormGroup>
                            <FormGroup controlId="password" className="input" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
                                <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
                            { errors.password &&
                                <HelpBlock>{errors.password}</HelpBlock>
                            }
                            </FormGroup>
                            <Button type="submit" bsStyle="primary" className="singin">Sign-In</Button>
                        </form>
                    </Row>
                </div>
            )
        } else {
            return(
                <div className="TableFaculties">
                    <TableFaculties/>
                </div>
            )
        }
    }
}

export default Login;
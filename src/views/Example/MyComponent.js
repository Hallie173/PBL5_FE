import React from "react";

class MyComponent extends React.Component {
    state = {
        name: 'Hallie',
        status: 'Single',
    }

    handleOnChangeName = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    handleClickButton = () => {
        alert('Clicked!!!');
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <input value={this.state.name} type="text" onChange={(event) => this.handleOnChangeName(event)}></input>
                </div>
                <div>Hello, my name is {this.state.name} </div>
                <div className="clickme">
                    <button onClick={() => this.handleClickButton()}>Click me!</button>
                </div>
            </React.Fragment >
        )
    }
}

export default MyComponent;
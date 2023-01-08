var Calculator = React.createClass({
     getInitialState: function() {
        return {
            displayValue: "0",
            equationValue: ""
        };
    },
    setValues: function(entry) {
        switch(entry) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case ".":
                if(this.state.displayValue.length <= 9) {  
                    if(this.state.displayValue === "0" && this.state.equationValue === "") {
                        this.setState({displayValue: entry}, function () {
                            if(entry !== "0") {
                                this.setState({equationValue: entry});
                            }
                        });
                    }
                    else if(this.state.displayValue === "+" || this.state.displayValue === "-" || this.state.displayValue === "*" || this.state.displayValue === "/") {
                         this.setState({displayValue: entry},  function() {
                                this.setState({equationValue: this.state.equationValue + entry});
                            });
                    } else if(entry !== "." || this.state.displayValue.indexOf(".") === -1) {
                            this.setState({displayValue: this.state.displayValue + entry},  function() {
                                this.setState({equationValue: this.state.equationValue + entry});
                            });  
                    }          
                }
                break;
            case "/":
            case "*":
            case "-":
            case "+":
                if(this.state.equationValue.length !== 0 && this.state.displayValue !== "." && this.state.displayValue !== "*" &&
                   this.state.displayValue !== "/" && this.state.displayValue !== "+" && this.state.displayValue !== "-" ) 
                {
                    this.setState({displayValue: entry}, function() {
                        this.setState({equationValue: this.state.equationValue + entry});
                    });
                }
                break;
             case "=":
                if(this.state.equationValue.length !== 0) {
                    var answer = (Math.round((eval(this.state.equationValue) + 0.00001) * 100) / 100).toString();                   
                    if(isFinite(answer)) {
                        if(answer.length <= 10) {
                            if(answer !== "0") {
                                this.setState({ displayValue: answer}, function() {
                                   this.setState({equationValue: answer});
                                });
                            } else {
                                 this.setState({ displayValue: "0"}, function() {
                                     this.setState({equationValue: ""});
                                 });
                            }                          
                        } else {
                            this.setState({ displayValue: "Too Large!"}, function() {
                                this.setState({equationValue: ""});
                            });
                        }
                    } else {
                        this.setState({ displayValue: "0"}, function() {
                            this.setState({equationValue: ""});
                        });
                    }
                }
                break;
            case "AC":
                this.setState({displayValue: "0"}, function() {
                    this.setState({equationValue: ""});
                });
                break;
            case "CE":
                if(this.state.equationValue.length > 0) {
                        this.setState({equationValue: this.state.equationValue.slice(0,-1)}, function() {
                            if(this.state.displayValue.length > 1) {
                                this.setState({displayValue: this.state.displayValue.slice(0,-1)});
                            } else {
                                 this.setState({displayValue: this.state.equationValue.slice(-1)}, function() {
                                     if(this.state.displayValue === "") {
                                         this.setState({displayValue: "0"});
                                     }
                                 });
                            }
                        });
                   }
                break;
        }           
    },
    render: function() {
        return (
            <div id="calculator">
                <div id="logo">Free Code Camp</div>
                <Display displayValue={this.state.displayValue} />
                <div id="buttons-container">
                    <div id="row-1-buttons">
                        <Button setValues={this.setValues} buttonValue="AC" classNames="btn btn-standard clear-btn" />
                        <Button setValues={this.setValues} buttonValue="CE" classNames="btn btn-standard clear-btn" />
                        <Button setValues={this.setValues} buttonValue="/" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="*" classNames="btn btn-standard" />
                    </div>
                    <div id="row-2-buttons">
                        <Button setValues={this.setValues} buttonValue="7" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="8" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="9" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="-" classNames="btn btn-standard" />
                    </div>
                    <div id="row-3-buttons">
                        <Button setValues={this.setValues} buttonValue="4" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="5" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="6" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="+" classNames="btn btn-standard" />
                    </div>
                     <div id="row-4-buttons">
                        <Button setValues={this.setValues} buttonValue="1" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="2" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="3" classNames="btn btn-standard" />
                        <Button setValues={this.setValues} buttonValue="=" classNames="btn btn-equals" />
                    </div>
                    <div id="row-5-buttons">
                        <Button setValues={this.setValues} buttonValue="0" classNames="btn btn-zero" />
                        <Button setValues={this.setValues} buttonValue="." classNames="btn btn-standard" />
                    </div>
                </div>
            </div>
        );
    }
});
var Display = React.createClass({
    render: function() {
        return (
            <div id="display">
                <div id="entry">{this.props.displayValue}</div>
            </div>
        );
    }
});
var Button = React.createClass({
    handleClick: function() {
        this.props.setValues(this.props.buttonValue);
    },
    render: function() {                    
        return (<button onClick={this.handleClick} className={this.props.classNames}>{this.props.buttonValue}</button>);
    }
});
ReactDOM.render(<Calculator />, document.body);
const Stars = (props) => {

    return (
            <div className='col-5'>
            {_.range(props.numOfStars).map( i => 
                <i key={i} className='fa fa-star'/>
                )}
            </div>
           );
};

const Button = (props) => {
    let button;
    switch(props.answerIsCorrect) {
        case true:
            button = <button onClick={props.acceptAnswer} className='btn btn-success' disabled={props.doneStatus}><i className='fa fa-check'/></button>;
            break;
        case false:
            button = <button onClick={props.checkAnswer} className='btn btn-danger' disabled={props.doneStatus}><i className='fa fa-times'/></button>;
            break;
        case null:
            button = <button onClick={props.checkAnswer} className='btn' disabled={props.doneStatus || props.selected.length === 0} >=</button>;
            break;
    }
    return (
            <div style={{marginTop: '2px'}} className='col-2 text-center'>
            {button}
            <button onClick={props.redraw} style={{marginTop: '15px'}} className='btn btn-warning btn-sm' disabled={props.doneStatus || props.remainingRedraws === 0}>
            <i style={{marginRight: '5px'}} className='fa fa-refresh' />
            {props.remainingRedraws}
            </button>
            </div>
           );
};

const Answer = (props) => {
    return (
            <div className='col-5'>
            {props.selected.map(n => 
                <span key={n} className='num1-9'
                onClick={() => props.unselectNumber(n)}>
                {n}</span>
                )}
            </div>
           );
};

const Numbers = (props) => {
    getClassName = (number) => {
        if(props.used.indexOf(number) >= 0) {
            return 'num1-9 used';
        }
        if(props.selected.indexOf(number) >= 0) {
            return 'num1-9 selected';
        }
        return 'num1-9';
    }
    return (
            <div className='card text-center'>
            <div>
            {Numbers.list.map( (n,i) => 
                <span key={i} className={getClassName(n)}  
                onClick={() => props.selectNumber(n)}>{n}</span>
                )}
            </div>
            </div>
           );
};

// shared variable 
Numbers.list = _.range(1, 10);

const Status = (props) => {
    return (
            <div className='text-center'>
            <h2>{props.doneStatus}</h2>
            </div>
           );
};

class Game extends React.Component {
    static random19 = () => 1 + Math.floor(Math.random()*9);
    //  static random19 = () => 9; // for tests

    state = {
        selected: [],
        used: [],
        numOfStars: Game.random19(),
        answerIsCorrect: null,
        remainingRedraws: 5,
        doneStatus: null,
    };

    selectNumber = (n) => {
        if(this.state.selected.indexOf(n) < 0 && this.state.used.indexOf(n) < 0) {
            this.setState(prevState => ({
                selected: prevState.selected.concat(n),
                answerIsCorrect: null,
            }));
        }
    };

    unselectNumber = (n) => {
        this.setState(prevState => ({
            selected: prevState.selected.filter(i => n !== i),
            answerIsCorrect: null,
        }));
    };

    checkAnswer = () => {
        this.setState(prevState => ( {
            answerIsCorrect: prevState.selected.reduce((acc, n) => acc + n, 0) === prevState.numOfStars
        }));
    };

    redraw = () => {
        if(this.state.remainingRedraws > 0) {
            this.setState(prevState => ({
                numOfStars: Game.random19(),
                answerIsCorrect: null,
                selected: [],
                remainingRedraws: prevState.remainingRedraws-1,
            }), this.updateStatus);
        }
    };

    acceptAnswer = () => {
        this.setState(prevState => ({
            used: prevState.used.concat(prevState.selected),
            selected: [],
            answerIsCorrect: null,
            numOfStars: Game.random19(),
        }), this.updateStatus);
    };

    updateStatus = () => {
        this.setState(prevState => {
            if(prevState.used.length === 9) {
                return { doneStatus: 'Well done!' };
            }
            if(prevState.remainingRedraws === 0) {
                return {doneStatus: 'Game over!'};
            }
        });
    };

    render() {
        const {selected, used, numOfStars, answerIsCorrect, remainingRedraws, doneStatus} = this.state;
        return (
                <div className='container'>
                <h3>Play nine</h3>
                <div className='row'>
                <Stars numOfStars={numOfStars} />
                <Button selected={selected} 
                checkAnswer={this.checkAnswer} 
                acceptAnswer={this.acceptAnswer}
                redraw={this.redraw}
                answerIsCorrect={answerIsCorrect}
                remainingRedraws={remainingRedraws}
                doneStatus={doneStatus}
                />
                <Answer selected={selected} unselectNumber={this.unselectNumber} />
                </div>
                <br />
                {
                    doneStatus?  <Status doneStatus={doneStatus} /> 
            : <Numbers selectNumber={this.selectNumber} selected={selected} used={used} />
                }
                </div>
                    );
    }
}

class App extends React.Component {
    render() {
        return (
                <div>
                <Game />
                </div>
               );
    }
}

ReactDOM.render(<App />, mountNode);

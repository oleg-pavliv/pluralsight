const Card = (props) => {
    return (
            <div style={{margin: '1em'}}>
            <img src={props.avatar_url} width='75' />
            <div style={{display: 'inline-block', marginLeft: 10}}>
            <div style={{fontSize: '1.25em'}}>{props.name}</div>
            <div>{props.company}</div>
            </div>
            </div>
           );
};

const CardList = (props) => {
    return (
            <div>
            {props.cards.map( card => <Card {...card} />)}
            </div>
           );
};

class Form extends React.Component {
    state = {userName: ''};

    handleSubmit = (event) => {
        event.preventDefault();
        axios.get(`https://api.github.com/users/${this.state.userName}`)
            .then(resp => {
                this.props.onSubmit(resp.data);
                this.setState({ userName: ''});
            }) 
    };

    render() {
        return (
                <form onSubmit={this.handleSubmit}>
                <input type='text' placeholder='Github username' 
                value={this.state.userName}
                onChange={(event) => this.setState({userName: event.target.value})}
                required />
                <button type='submit'>Add card</button>
                </form>
               );
    }
}

class App extends React.Component {
    state = {
        cards: [
        {
            name:'Oleg Pavliv',
            avatar_url:'https://avatars3.githubusercontent.com/u/1021455?v=4',
            company:'Nagravision'
        }
        ]};

    addNewCard = (cardInfo) => {
        this.setState(prevState => ({
            cards: prevState.cards.concat(cardInfo)
        }));
    };

    render() {
        return (
                <div>
                <Form onSubmit={this.addNewCard} />
                <CardList cards={this.state.cards}/>
                </div>
               );
    }
}


ReactDOM.render(<App />, mountNode);

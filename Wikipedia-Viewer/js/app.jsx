var App = React.createClass({
    getInitialState: function() {
        return {
            searchResults: null
        };
    },
    setSearchResults: function(searchTerm) {
        var api = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=10&prop=extracts&exchars=200&exintro&exlimit=max&explaintext&&callback=?&gsrsearch=" + searchTerm;
        $.getJSON(api, function(data) {
            if (data.query) {
                var arr = [];
                for (var prop in data.query.pages) {
                    arr.push(data.query.pages[prop]);
                }
                this.setState({searchResults: arr});
            } 
            else {
                this.setState({searchResults: false});
            }
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <SearchBox setSearchResults={this.setSearchResults} />
                <ArticleList articleData={this.state.searchResults} />                
            </div>
        );
    }
});
var SearchBox = React.createClass({
    propTypes: {
        setSearchResults: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            text: ""
        };
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleFormSubmit: function(e) {
        if (this.state.text !== "") {
            this.props.setSearchResults(this.state.text);
            this.setState({text: ""});
        }
        e.preventDefault();
        document.activeElement.blur();
    },
    render: function() {
        return (
            <div>
                <div className="row">
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="col s12 m8 l6 offset-m2 offset-l3">
                            <input id="search" className="" type="search" placeholder="Enter search term here" required value={this.state.text} onChange={this.handleTextChange} /> 
                        </div>
                    </form>
                </div>
                <div class="row">
                    <div className="center-align" id="randomButton"> 
                        <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" className="btn">Random</a>
                    </div>
                </div>
            </div>
        );
    }
});
var ArticleList = React.createClass({
    propTypes: {
        articleData: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    componentDidUpdate: function() {
        if($(window).scrollTop() < 50){
            window.scrollBy(0, 150);
        }  
    },
    render: function() {
        if (this.props.articleData === null) {
            return (null);
        } else if (this.props.articleData === false) {
            return (<p className="center-align">No Results!</p>);
        } else {
            var articleNodes = this.props.articleData.map(function(article) {
                return (<Article key={article.pageid}  title={article.title} excerpt={article.extract} pageId={article.pageid} />);
            });
            return (<div>{articleNodes}</div>);
        }
    }
});
var Article = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        excerpt: React.PropTypes.string,
        pageId: React.PropTypes.number
    },
    render: function() {
        return (
            <a href={"https://en.wikipedia.org/?curid=" + this.props.pageId} target="_blank"> 
                <div className="article card-panel hoverable animated bounceInUp">
                    <div className="row valign-wrapper">
                        <div className="col s12 m5 l4 valign"><h5>{this.props.title}</h5></div>
                        <div className="col s12 m7 l8 valign"><p>{this.props.excerpt}</p></div>                            
                    </div>               
                </div>
            </a>
        );
    }
});
ReactDOM.render(<App/>, document.getElementById("app"));

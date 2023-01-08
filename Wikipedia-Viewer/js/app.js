"use strict";

var App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
        return {
            searchResults: null
        };
    },
    setSearchResults: function setSearchResults(searchTerm) {
        var api = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=10&prop=extracts&exchars=200&exintro&exlimit=max&explaintext&&callback=?&gsrsearch=" + searchTerm;
        $.getJSON(api, function (data) {
            if (data.query) {
                var arr = [];
                for (var prop in data.query.pages) {
                    arr.push(data.query.pages[prop]);
                }
                this.setState({ searchResults: arr });
            } else {
                this.setState({ searchResults: false });
            }
        }.bind(this));
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(SearchBox, { setSearchResults: this.setSearchResults }),
            React.createElement(ArticleList, { articleData: this.state.searchResults })
        );
    }
});
var SearchBox = React.createClass({
    displayName: "SearchBox",

    propTypes: {
        setSearchResults: React.PropTypes.func
    },
    getInitialState: function getInitialState() {
        return {
            text: ""
        };
    },
    handleTextChange: function handleTextChange(e) {
        this.setState({ text: e.target.value });
    },
    handleFormSubmit: function handleFormSubmit(e) {
        if (this.state.text !== "") {
            this.props.setSearchResults(this.state.text);
            this.setState({ text: "" });
        }
        e.preventDefault();
        document.activeElement.blur();
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "form",
                    { onSubmit: this.handleFormSubmit },
                    React.createElement(
                        "div",
                        { className: "col s12 m8 l6 offset-m2 offset-l3" },
                        React.createElement("input", { id: "search", className: "", type: "search", placeholder: "Enter search term here", required: true, value: this.state.text, onChange: this.handleTextChange })
                    )
                )
            ),
            React.createElement(
                "div",
                { "class": "row" },
                React.createElement(
                    "div",
                    { className: "center-align", id: "randomButton" },
                    React.createElement(
                        "a",
                        { href: "https://en.wikipedia.org/wiki/Special:Random", target: "_blank", className: "btn" },
                        "Random"
                    )
                )
            )
        );
    }
});
var ArticleList = React.createClass({
    displayName: "ArticleList",

    propTypes: {
        articleData: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    componentDidUpdate: function componentDidUpdate() {
        if ($(window).scrollTop() < 50) {
            window.scrollBy(0, 150);
        }
    },
    render: function render() {
        if (this.props.articleData === null) {
            return null;
        } else if (this.props.articleData === false) {
            return React.createElement(
                "p",
                { className: "center-align" },
                "No Results!"
            );
        } else {
            var articleNodes = this.props.articleData.map(function (article) {
                return React.createElement(Article, { key: article.pageid, title: article.title, excerpt: article.extract, pageId: article.pageid });
            });
            return React.createElement(
                "div",
                null,
                articleNodes
            );
        }
    }
});
var Article = React.createClass({
    displayName: "Article",

    propTypes: {
        title: React.PropTypes.string,
        excerpt: React.PropTypes.string,
        pageId: React.PropTypes.number
    },
    render: function render() {
        return React.createElement(
            "a",
            { href: "https://en.wikipedia.org/?curid=" + this.props.pageId, target: "_blank" },
            React.createElement(
                "div",
                { className: "article card-panel hoverable animated bounceInUp" },
                React.createElement(
                    "div",
                    { className: "row valign-wrapper" },
                    React.createElement(
                        "div",
                        { className: "col s12 m5 l4 valign" },
                        React.createElement(
                            "h5",
                            null,
                            this.props.title
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col s12 m7 l8 valign" },
                        React.createElement(
                            "p",
                            null,
                            this.props.excerpt
                        )
                    )
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));

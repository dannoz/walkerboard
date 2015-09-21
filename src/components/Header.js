import React from "react";
import Dashboard from "../lib/Dashboard";
import Credit from "./Credit";
import cx from "classnames";
import { makeURL } from "../lib/querystring";

export default React.createClass({
    displayName: "Header",
    propTypes: {
        boardURL: React.PropTypes.string.isRequired,
        branding: React.PropTypes.object.isRequired,
        boards: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Dashboard)).isRequired,
        current: React.PropTypes.number.isRequired,
        onChangeBoard: React.PropTypes.func.isRequired,
        onOpenModal: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return { dropdownOpen: false };
    },
    toggleDropdown() {
        if (!this.state.dropdownOpen) {
            this.setState({ dropdownOpen: true }, () => {
                //bind the window to close.
                const toggle = () => {
                    window.removeEventListener("click", toggle);
                    this.setState({ dropdownOpen: false });
                };
                process.nextTick(() => window.addEventListener("click", toggle));
            });
        }
    },
    render() {
        const allDashboards = this.props.boards
            //map to an object with the original index and title, if data exists
            .map((board, index) => board.boardData.when({
                ok: data => ({ index: index, title: data.title }),
                error: () => ({ index: index, title: <span className="text-danger"><span className="glyphicon glyphicon-exclamation-sign" />{` Failed to load board ${index + 1}`}</span> })
            }));

        //get a ref to the current
        const currentDashboard = allDashboards[this.props.current];

        //others is this list filtered for loading items, but including the current one.
        //this is because the list the remains static once loaded. so positions don't change
        //which could confuse the user.
        const otherDashboards = allDashboards.filter(data => data);

        let currentTitleAndOtherDropdown;
        if (otherDashboards.length > 1) {
            currentTitleAndOtherDropdown = <li style={{ marginRight: 8 }}className={cx({ "btn-group": true, "open": this.state.dropdownOpen })}>
                <button className="btn btn-link navbar-btn dropdown-toggle" onClick={this.toggleDropdown} role="button" aria-haspopup="true" aria-expanded="true">
                    {currentDashboard.title}
                    {" "}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" style={{ marginTop: -10 }}>
                    {otherDashboards.map(data => <li key={`dash-${data.index}`}>
                        <a href={makeURL({ board: this.props.boardURL, tab: data.index })} onClick={this.onChangeBoard.bind(this, data.index)}>{data.title}</a>
                    </li>)}
                </ul>
            </li>;
        } else {
            currentTitleAndOtherDropdown = <li className="navbar-text">{currentDashboard.title}</li>;
        }

        let logo;
        if (this.props.branding.logo) {
            //funky inline styles match the correct height image, works best if square-ish and 32px high.
            logo = <img style={{ marginTop: -5, marginRight: 10, display: "inline-block", height: 32 }} src={this.props.branding.logo} />;
        }

        return <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href={this.props.branding.url}>
                        {logo}
                        {this.props.branding.text}
                    </a>
                    <div className="navbar-text"><small><Credit /></small></div>
                </div>
                <ul className="nav navbar-nav navbar-right">
                    {currentTitleAndOtherDropdown}
                    <li className="btn-group" style={{ marginRight: 8 }}>
                        <button className="btn btn-primary navbar-btn" title="Open new Dashboard" onClick={this.props.onOpenModal}>
                            <span className="glyphicon glyphicon-folder-open" />
                        </button>
                    </li>
                    <li className="btn-group" style={{ marginRight: 16 }}>
                        <button className="btn navbar-btn" title="Reload" onClick={() => window.location.reload()}>
                            <span className="glyphicon glyphicon-refresh" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>;
    },
    componentDidMount() {
        this.updateWindowTitle(this.props.branding.text);
    },
    componentWillUnmount() {
        this.updateWindowTitle("WalkerBoard");
    },
    updateWindowTitle(text) {
        window.document.title = text;
    },
    onChangeBoard(index, ev) {
        ev.preventDefault();
        this.props.onChangeBoard(index);
    }
});

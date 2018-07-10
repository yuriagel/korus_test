import 'babel-polyfill'

var React = require('react');
var ReactDOM = require('react-dom');
require('./index.css');

import {hashHistory, Router, Route, IndexRoute,Link} from "react-router";

var ZipCode = require('./components/ZipCode');
var Forecast = require('./components/Forecast');
var Detail = require('./components/Detail');

class Header extends React.Component {
    render() {
        //let href = window.location.href;
        let title = "Погода";
        //if (href.indexOf("?city=")>0) title = href.substr(href.indexOf("?city=")+6); &#9636;
        return (
            <div className='navbar'>
                <h1>{title}</h1>
                <ZipCode direction='row'/>
            </div>
        )
    }
}

class MainPage extends React.Component {
    render() {
        return (
            <div className='home-container' style={{backgroundImage: "url('app/images/pattern.svg')"}}/>)
    }
}

ReactDOM.render(
    <div className='container'>
        <Header/>
        <Router history={hashHistory}>

            <Route path="/">

                <IndexRoute component={MainPage}/>
                <Route path='/forecast' component={Forecast}/>
                <Route path='/details/:city' component={Detail}/>
            </Route>

        </Router>
    </div>,


    document.getElementById('app')
);
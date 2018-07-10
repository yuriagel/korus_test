import WeatherFrame from "./WeatherFrame";

const React = require('react');
const api = require('../utils/api');
const DayItem = require('./DayItem');
import {hashHistory} from "react-router";

class Forecast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastData: [],
            loading: true
        };

        this.makeRequest = this.makeRequest.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        this.setParams(this.props.location.query);

    }

    setParams(search={}) {
        this.city = search.city;
        this.lat = search.lat;
        this.lon = search.lon;
        this.makeRequest(this.city, this.lon, this.lat);
    }

    componentWillReceiveProps(nextProps) {
      console.log(nextProps);
        this.setParams(nextProps.location.query);
    }

    makeRequest(city, lon, lat) {
        this.setState({loading: true, errorMessage: undefined});
    console.log(city, lon, lat)
        api.getForecast(city, lon, lat)
            .then(function (res) {
                if (res.error) {
                    this.setState({
                        loading: false,
                        errorMessage: <div>Не удалось найти данные.<p>Ошибка: {res.error}</p></div>
                    })
                } else {
                    this.setState({loading: false, forecastData: res})
                }
            }.bind(this)).catch(e => {
            this.setState({loading: false, errorMessage: 'Не удалось найти данные. проверьте правильность ввода' + e})
        })
    }

    handleClick(city) {
        console.log(city)
        city.city = this.city||this.state.forecastData.city.name;
        hashHistory.push({
            pathname: '/details/' +city.city,
            state: city,
        })
    }

    errorMessage() {
        return (<div className='home-container' style={{backgroundImage: "url('app/images/pattern.svg')"}}>
            <h1 className='header'>{this.state.errorMessage}</h1>
        </div>)
    }

    render() {
        if (this.state.errorMessage) return this.errorMessage();
        if (this.state.loading === true) return <h1 className='forecast-header'> Идет загрузка </h1>;
        return <div>
            <h1 className='forecast-header'>{this.city||this.state.forecastData.city.name}</h1>
            <div className='forecast-container'>
                {this.state.forecastData.list && this.state.forecastData.list.map((listItem) => {
                    return <DayItem onClick={this.handleClick.bind(this, listItem)} key={listItem.dt} day={listItem}/>
                }, this)}
            </div>
            {!IS_OFFLINE && <WeatherFrame obj={this.state.forecastData}/>}

        </div>
    }
}

module.exports = Forecast;
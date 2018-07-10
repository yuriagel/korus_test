const React = require('react');
const PropTypes = require('prop-types');
/*import {Async} from 'react-select'; клевый херовоработающий плагин*/
import debounce from 'lodash/debounce'


class TextForm extends React.Component {
    render() {
        return (<input className='form-control' type='text'{...this.props}/>)
    }
}

class ZipCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zipcode: this.props.zipcode || '', isCytyName: true
        };

        this.handleSubmitZipcode = this.handleSubmitZipcode.bind(this);
        this.changed = debounce(this.handleSubmitZipcode, this.props.debounce ? this.props.debounce : 750);

    }

    /*   это получение данных через гугл апи. не пригодилось getOptions(input)  {
        fetch(_API_CONFIG_ + `/places?input=${input}`, {
          method: 'get', credentials: 'same-origin', headers: headers
        })
          .then((response) => {
            return response.json();
          }).then((json) => {
          console.log(json);
          this.setState({options:  json.predictions})
          return {options:  json.predictions}
        }).catch(e => {
          return {
            options: [{value: 'one', label: 'One'}, {value: 'two', label: 'Two'}]
          }
        });

      };*/


    handleSubmitZipcode() {
        if (this.state.isCytyName) {
            if (this.state.zipcode.length > 3) {
                window.open('#/forecast?city=' + this.state.zipcode, '_self')
            }
        } else {
            if (parseFloat(this.state.lat) > 0 && parseFloat(this.state.lon) > 0)
                window.open('#/forecast?lat=' + this.state.lat + '&lon=' + this.state.lon, '_self')
        }
        /* this.setState(function () {
           return {
             zipcode: ''
           }
         })*/
    }

    handleUpdateLon(e) {
        let zip = e.target.value;
        this.setState({lon: zip}, () => this.changed(zip));
    }

    handleUpdateLat(e) {
        let zip = e.target.value;
        this.setState({lat: zip}, () => this.changed(zip));

    }

    handleChange = e => {
        let zip = e.target.value;
        this.setState({zipcode: zip}, () => this.changed(zip));
    };

    findCurrentWeather() {
        navigator.geolocation.getCurrentPosition((el) => {
            console.log(el)
            this.setState({lat: el.coords.latitude, lon: el.coords.longitude});

            window.open('#/forecast?lat=' + el.coords.latitude + '&lon=' + el.coords.longitude, '_self')
        })
    }


    render() {
        let {isCytyName = true} = this.state;

        return (<div className='zipcode-container' style={{flexDirection: 'row', width: "50%"}}>


            <p style={{fontSize: '26px', marginRight: '20px'}}>&#128269;</p>

            {!isCytyName && <TextForm onChange={::this.handleUpdateLon} placeholder='широта' title="Широта" value={this.state.lon}/>}
            {!isCytyName && <TextForm onChange={::this.handleUpdateLat} placeholder='долгота' title="Долгота" value={this.state.lat}/>}

            {isCytyName && <TextForm onChange={::this.handleChange} placeholder='Например Москва' title="Введите название города, например Москва'" value={this.state.zipcode}/>}
            <div style={{flexDirection: 'row', display: 'inline-flex'}}>
                <input style={{width: "50px"}} className='form-control' type="checkbox"
                       title={"Поиск по названию города/По Координатам"}
                       checked={this.state.isCytyName}
                       onChange={() => this.setState({isCytyName: !this.state.isCytyName})}/>
                <button
                    type='button'
                    title={"Текущее положение"}
                    className='btn btn-success'
                    onClick={::this.findCurrentWeather}>
                    &#10687;
                </button>
            </div>
        </div>)
    }
}

ZipCode.defaultProps = {
    direction: 'column'
};

ZipCode.propTypes = {
    direction: PropTypes.string,
};

module.exports = ZipCode;
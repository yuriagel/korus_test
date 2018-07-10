const React = require('react');
const DayItem = require('./DayItem');
const convertTemp = require('../utils/helpers').convertTemp;

class Detail extends React.Component {
  render() {
    let props = this.props.location.state;
    return (
      <div className='forecast-container'>
        <DayItem day={props} />
        <div className='description-container'>
          <h4>{props.city}</h4>
          <p>{props.weather[0].description}</p>
          <p>Мин : {convertTemp(props.temp.min)} &#8451;    Мах: {convertTemp(props.temp.max)} &#8451;</p>
            <p>День: {convertTemp(props.temp.day)} &#8451;   Ночь : {convertTemp(props.temp.night)} &#8451;</p>
            <p/>
          <p>Влажность: {props.humidity}</p>
        </div>
      </div>
    )
  }
}

module.exports = Detail;
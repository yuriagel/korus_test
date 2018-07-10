const React = require('react');
const utils = require('../utils/helpers');
const getDate = utils.getDate;
const convertTemp = require('../utils/helpers').convertTemp;
function getTitle(obj) {
    return `${obj.weather[0].description} \r\n мин ${convertTemp(obj.temp.min)} мax ${convertTemp(obj.temp.max)}\r\nВлажность ${obj.humidity} `
}

function DayItem (props) {
  let date = getDate(props.day.dt);
    let icon = props.day.weather[0].icon;
  return (
    <div onClick={props.onClick} className='dayContainer'>
      <img className='weather' title={getTitle(props.day)} src={'/app/images/weather-icons/' + icon + '.svg'} alt='Weather' />
        <h2 className='subheader' >{date +`, t ${convertTemp(props.day.temp.min)} - ${convertTemp(props.day.temp.max)}`}&#8451;</h2>
    </div>
  )
}

module.exports = DayItem;
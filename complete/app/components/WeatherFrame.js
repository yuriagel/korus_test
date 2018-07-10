var React = require('react');

export default class WeatherFrame extends React.Component {
  render() {
    let {lon, lat} = this.props.obj.city.coord;
    let {name} = this.props.obj.city;
    let url = '//forecast.io/embed/#lat=' + lat + '&lon=' + lon + '&name=' + name + '&units=si&lang=ru';

    return (React.createElement('iframe', {
        type: 'text/html',
        height: 200,
        width:'100%',
        frameBorder: '0',
        src: url
      }))
  }

}

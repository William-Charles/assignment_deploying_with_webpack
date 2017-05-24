import React, { Component } from "react";
import CityForm from "./CityForm";
import Weather from "./Weather";

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

class WeatherContainer extends Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      city: "",
      weather: []
    };

    this.success = this.success.bind(this);
  }

  success(pos, customParam) {
    let url;
    if (pos) {
      var crd = pos.coords;
      console.log(customParam);
      let latt = crd.latitude;
      let long = crd.longitude;
      url = `https://www.metaweather.com/api/location/search/?lattlong=${latt},${long}`;
    } else {
      url = `https://www.metaweather.com/api/location/search/?query=${customParam}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(json => {
        let woeid = json[0].woeid;
        return fetch(`https://www.metaweather.com/api/location/${woeid}/`);
      })
      .then(response => response.json())
      .then(json => {
        console.log("second api call response: ", json);
        this.setState({
          isFetching: false,
          city: json.title,
          weather: json.consolidated_weather[0]
        });
      });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.success, error);
  }

  render() {
    return (
      <div>
        <CityForm />
        <Weather
          weather={this.state.weather}
          isFetching={this.state.isFetching}
          city={this.state.city}
        />
      </div>
    );
  }
}

export default WeatherContainer;

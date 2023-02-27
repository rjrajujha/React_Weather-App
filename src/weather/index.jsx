import { useEffect, useState } from "react";
import axios from "axios";
import Styles from "./styles.module.css";

let last3cities = [];

const Weather = () => {

    const [validCity, isValidCity] = useState(true);
    const [currentData, setCurrentData] = useState([])
    const [searchText, setSearchText] = useState('');

    const fetchData = async (city) => {

        let API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=68af96dbc692bc028a8c4b0f6613faef`

        await axios
            .get(API_URL)
            .then((res) => {

                if (res.data.length) {
                    setCurrentData(res.data);
                    isValidCity(true);

                    let currentCityName = res.data[0].name;
                    if (last3cities.length === 3) {
                        last3cities.shift();
                    }
                    last3cities.push(currentCityName);

                } else {
                    isValidCity(false);
                }

            }).catch((e) => {
                console.log("Error Connecting API :", e)
            }).finally(() => {
                console.log("Data Fetched");

            })
    }

    useEffect(() => {

        //Show/Hide Last 3 cities 
        if (!searchText.length) {
            let shoeHideLastCities = document.getElementById("toggleTastCcities");
            shoeHideLastCities.removeAttribute("style", "display:none;");

            let weatherInfo = document.getElementById("weatherInfo");
            weatherInfo.setAttribute("style", "display:none;");

            if (!last3cities.length) {
                let toggleTastCcities = document.getElementById("toggleTastCcities");
                toggleTastCcities.setAttribute("style", "display:none;");
            }
            if (last3cities.length) {
                let toggleTastCcities = document.getElementById("toggleTastCcities");
                toggleTastCcities.removeAttribute("style", "display:none;");
            }

        }

        if (searchText.length) {
            let shoeHideLastCities = document.getElementById("toggleTastCcities");
            shoeHideLastCities.setAttribute("style", "display:none;");

            let searchBox = document.getElementById("searchBox");
            let weatherInfo = document.getElementById("weatherInfo");
            searchBox.addEventListener('keypress', (event) => {
                if (event.key === "Enter") {

                    console.log("Data fetching")
                    fetchData(searchText);

                    if (validCity) {
                        weatherInfo.removeAttribute("style", "display:none;");
                    }
                }
            })
        }

        if (!validCity) {
            let validCityWarn = document.getElementById("validCityWarn");
            validCityWarn.removeAttribute("style", "display:none;");
        }

        if (validCity) {
            let validCityWarn = document.getElementById("validCityWarn");
            validCityWarn.setAttribute("style", "display:none;");
        }

    })

    return (
        <>
            <div className={Styles.weather_card}>
                <div className={Styles.headText}> Weather App </div>
                <input className={Styles.search_box} value={searchText} onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Enter City Name" id="searchBox" />

                <div className={Styles.last3cities} style={{ display: "none" }} id="toggleTastCcities">
                    <div className={Styles.l3ctext}>  Last 3 city entries </div>
                    {last3cities.map((ele, idx) => {
                        return <p>{idx + 1}. {ele}</p>
                    })}
                </div>


                <div className={Styles.weatherInfo} id="weatherInfo">
                    {
                        currentData.map((data) => {
                            return <>
                                <p> City :  {data.name}</p>
                                <p> Lon :  {data.lon}</p>
                                <p> Lat :  {data.lat}</p>
                                <p> Country :  {data.country}</p>
                                <p> State :  {data.state}</p>
                            </>
                        })
                    }
                </div>

                <div className={Styles.validCityWarn} id="validCityWarn">
                    Enter Valid City Name
                </div>

            </div>
        </>
    )

}

export default Weather;
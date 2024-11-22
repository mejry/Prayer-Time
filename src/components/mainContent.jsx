import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';

export default function MainContent() {
  const [timings, setTimings] = useState({
    Fajr: "05:30",
    Dhuhr: "12:03",
    Asr: "14:48",
    Maghrib: "17:07",
    Isha: "18:36",
  });
  const [city, setCity] = useState("Ariana");
  const [today, setToday] = useState("");

  const [nextPrayerIndex,setNextPrayerIndex]=useState(0)
  const [remainingTime, setRemainingTime] = useState("");

  const prayersArray=[
    {key:"Fajr",displayname:"Fajr"},
    {key:"Dhuhr",displayname:"Dhuhr"},
    {key:"Asr",displayname:"Asr"},
    {key:"Maghrib",displayname:"Maghrib"},
    {key:"Isha",displayname:"Isha"},
  ]

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=TN`
        );
        setTimings(response.data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer timings:", error);
      }
    };
    fetchTimings();
  }, [city]);

  useEffect(() => {
    const interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("MMM Do YYYY | hh:mm a"));

    return () => clearInterval(interval);
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    const fajrTime = moment(timings["Fajr"], "HH:mm");
    const dhuhrTime = moment(timings["Dhuhr"], "HH:mm");
    const asrTime = moment(timings["Asr"], "HH:mm");
    const maghribTime = moment(timings["Maghrib"], "HH:mm");
    const ishaTime = moment(timings["Isha"], "HH:mm");

    let prayerIndex=2 

    if (momentNow.isAfter(fajrTime) && momentNow.isBefore(dhuhrTime)) {
      prayerIndex=1
    } else if (momentNow.isAfter(dhuhrTime) && momentNow.isBefore(asrTime)) {
      prayerIndex=2
    } else if (momentNow.isAfter(asrTime) && momentNow.isBefore(maghribTime)) {
      prayerIndex=3
    } else if (momentNow.isAfter(maghribTime) && momentNow.isBefore(ishaTime)) {
      prayerIndex=4
    } else {
      prayerIndex=0
    }
    setNextPrayerIndex(prayerIndex);
    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
  const nextPrayerObject= prayersArray[prayerIndex]
  const nextPrayerTime= timings[nextPrayerObject.key]
  const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

  let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
  if (remainingTime < 0) {
    const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
    const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
      moment("00:00:00", "hh:mm:ss")
    );

    const totalDiffernce = midnightDiff + fajrToMidnightDiff;

    remainingTime = totalDiffernce;
  }
  console.log(remainingTime);
  const durationRemainingTime = moment.duration(remainingTime);

  setRemainingTime(
    `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
  );
  console.log(
    "duration issss ",
    durationRemainingTime.hours(),
    durationRemainingTime.minutes(),
    durationRemainingTime.seconds()
  );
  };

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <>
      {/* Top Row */}
      <Grid container>
        <Grid item xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{city}</h1>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div>
            <h2>Still until pray {prayersArray[nextPrayerIndex].displayname}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "white", opacity: "0.1" }} />

      {/* Prayer Cards */}
      <Stack direction="row" justifyContent="space-around" style={{ marginTop: "50px" }}>
      <Prayer name="Isha" time={timings.Isha} image="https://as1.ftcdn.net/v2/jpg/08/30/02/28/1000_F_830022872_QjBqSfAKUH6rgAhPfpss5I89c5DmoPrZ.jpg" />
      <Prayer name="Maghrib" time={timings.Maghrib} image="https://as2.ftcdn.net/v2/jpg/03/32/44/99/1000_F_332449996_0dcE7ETlQ93VvP9cNBSofNzqZ4I1ZUbQ.jpg" />
      <Prayer name="Asr" time={timings.Asr} image="https://as2.ftcdn.net/v2/jpg/05/72/98/95/1000_F_572989529_bOkvyjQcw3yMNj6JrcU9zsYp0KDfOGNr.jpg" />
      <Prayer name="Dhuhr" time={timings.Dhuhr} image="https://as2.ftcdn.net/v2/jpg/06/24/54/67/1000_F_624546799_aZlySiYx2tYkO8XzjaMzQyZ7u4YPOV3o.jpg" />
      <Prayer name="Fajr" time={timings.Fajr} image="https://as1.ftcdn.net/v2/jpg/06/27/96/34/1000_F_627963473_34DZRIGxfiXOJY07tY1hpesT4Dg0CwRZ.jpg" />
      </Stack>

      {/* Select City */}
      <Stack direction="row" justifyContent="center" style={{ marginTop: "40px" }}>
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="city-select-label"
            id="city-select"
            value={city}
            onChange={handleChange}
          >
            <MenuItem value="Tunis">Tunis</MenuItem>
            <MenuItem value="Ariana">Ariana</MenuItem>
            <MenuItem value="Sousse">Sousse</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
} from "@mui/material";

const currentTimezone = new Date().getTimezoneOffset();
const App = () => {
  const [principalTime, setPrincipalTime] = useState(new Date());
  const [teamTime, setTeamTime] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    consumeEnvVariable();
  }, []);

  const getHourFromUTCDifference = (utcDifferenceString, exactDate) => {
    const date = exactDate ?? new Date();
    const timeZoneOffset = date.getTimezoneOffset();
    const updatedTime = new Date(date.getTime() + timeZoneOffset * 60 * 1000);
    const utcDifference = Number(utcDifferenceString) * 60;
    if (currentTimezone === Math.abs(utcDifference)) {
      return date.toLocaleTimeString();
    }
    const timeWithUTCDifference = new Date(
      updatedTime.getTime() + utcDifference * 60 * 1000
    );
    return timeWithUTCDifference.toLocaleTimeString();
  };

  const consumeEnvVariable = () => {
    const teamTimeFromEnv = JSON.parse(import.meta.env.VITE_TEAM_TIME);
    setTeamTime(
      teamTimeFromEnv.map((t, idx) => ({
        id: idx + 1,
        teamMember: t.tm,
        utcDifference: t.utc,
        currentTime: getHourFromUTCDifference(t.utc),
      }))
    );
  };

  const updateTeamTimesWithCurrentTime = (exactDate) => {
    setTeamTime(
      teamTime.map((t) => ({
        ...t,
        currentTime: getHourFromUTCDifference(t.utcDifference, exactDate),
      }))
    );
  };

  const setCurrentTime = () => {
    setPrincipalTime(new Date());
    updateTeamTimesWithCurrentTime();
  };
  const changePrincipalTime = (val) => {
    setPrincipalTime(val);
    updateTeamTimesWithCurrentTime(val.toDate());
  };

  return (
    <div
      id="app"
      style={{
        width: "full",
        paddingTop: "2rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "310px" }}>
        <Stack spacing={2} direction="row">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              value={principalTime}
              onChange={changePrincipalTime}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            style={{
              width: "min-content",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
            }}
            onClick={setCurrentTime}
          >
            set current time
          </Button>
        </Stack>
      </div>
      <Stack
        style={{
          minWidth: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Team Time</h3>
        <Grid container justifyContent="center" spacing={2} columns={3}>
          {!isUpdating &&
            teamTime.map((item, idx) => (
              <Grid key={idx} item xs={1}>
                <Card>
                  <CardContent
                    style={{
                      padding: "0px",
                      paddingBottom: "10px",
                      paddingTop: "10px",
                      paddingLeft: "0px",
                      paddingRigth: "0px",
                      height: "min-content",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <strong>
                        <span
                          style={{
                            color: "#444",
                          }}
                        >
                          {item.teamMember}
                        </span>
                      </strong>
                      <span
                        style={{
                          fontSize: "0.75rem",
                        }}
                      >
                        UTC {item.utcDifference}
                      </span>
                    </div>
                    <h5
                      style={{
                        lineHeight: "0",
                        textAlign: "center",
                        color: "#1976d2",
                      }}
                    >
                      {item.currentTime}
                    </h5>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Stack>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../../Components/Old Components/Navbar";
import JobView from "../../Components/Jobs/JobView";
import { DashboardLayout } from "../../Components/Applicant/Dashboard/dashboard-layout";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActionArea,
  Grid,
  Box,
  Modal,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//function where it calculate the number of days between the application date and today's date
function durationInDays(applicationDate) {
  var today = new Date();
  var date = new Date(applicationDate);
  var diff = Math.abs(today - date);
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

function ViewApplication() {
  const applicantId = JSON.parse(
    atob(localStorage.getItem("authToken").split(".")[1])
  ).detailId;
  const [Applications, setApplications] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState({});

  useEffect(() => { 
    axios
      .get(`http://localhost:5000/applications/byapplicant/${applicantId}`)
      .then((res) => {
        setApplications(res.data);
        setJobs(res.data.map((application) => application.job));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [applicantId]);

  const handleCardClick = (e) => {
    //get the job object from the jobs array
    handleOpen();
    setJob(jobs.find((job) => job._id === e));
  };

  return (
    <>
      <DashboardLayout tab="View Applications">
      <Container style={{marginTop: "126px"}} maxWidth="lg">
        <Grid container spacing={3}>
          {Applications.map((application) => (
            <Card
              key={application?._id}
              sx={{
                maxWidth: 345,
                boxShadow: 10,
                borderRadius: 3,
                padding: 1,
                margin: 1,
                width: "100%",
              }}
              my={2}
              onClick={handleOpen}
            >
              <CardActionArea
                onClick={() => handleCardClick(application?.job?._id)}
                key={job?._id}
              >
                <CardHeader
                  title={application?.job?.name}
                  subheader={application?.job?.location}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {durationInDays(application?.applicationDate)} days ago
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Status : {application?.applicationStatus}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}

            {/* <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box>
                <JobView job={job} />

                {/* <Typography variant="body2" color="textSecondary" component="p">
                  {job?.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {job?.location}
                </Typography> */}
              {/* </Box>
            </Modal> */}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogContent>
              <JobView job={job} />
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

        </Grid>
      </Container>
      </DashboardLayout>
    </>
  );
}

export default ViewApplication;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { Button } from "react-bootstrap";
// import { Typography } from "@mui/material";
// import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
// import { useParams } from "react-router-dom";
// import { useParams } from "react-router-dom";

// const useStyles = makeStyles({
//   link: {
//     '&:hover': {
//       color: 'white',
//     },
//   },
// });

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "contact",
    numeric: false,
    disablePadding: false,
    label: "Contact",
  },
  {
    id: "applicationDate",
    numeric: false,
    disablePadding: false,
    label: "Application Date",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AppTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  // const [Applications, setApplications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = useState("");
  const [stat, setStat] = useState("");
  const [mail, setMail] = useState("");

  const {applicants, quota, job_id} = props;

  //email subject
  const subject = "Application Status";
  const body = "Congratulations! You have been shortlisted. Please prepare for the interview.";

  const fail = "Sorry! You have not been shortlisted. Please try again next time.";

  // const [combined, setCombined] = useState({ props, quota });

  // const applicationId = JSON.parse(
  //   atob(localStorage.getItem("authToken").split(".")[1])
  // ).detailId;

  useEffect(() => {
    // set rows from props
    // setRows(combined.props1.applicants, combined.quota.quota);
    // console.log("inside", combined.props1.applicants);

    setRows(applicants, quota, job_id);

  }, [applicants, job_id, quota]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleClickOpen = (id, appStatus, email) => {
    setDetails(id);
    setStat(appStatus);
    setMail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShortlist = async (applicationId, status, currentQuota, id) => {
    // e.preventDefault();
    axios
      .patch(`http://localhost:5000/applications/${applicationId}`, {
        applicationStatus: status,
      })
      .then((res) => {
        
        
        if(status === "Shortlisted"){
          handleQuota(currentQuota - 1, id);
        }else if(status === "Rejected"){
          handleQuota(currentQuota + 1, id);
        }

        window.alert("Application is updated.");
        window.location.href = `/executive/manage-applicant`;

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleQuota = async (latestQuota, id) =>{
    axios
      .patch(`http://localhost:5000/jobs/${id}`, {
        quota: latestQuota,
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const deleteApplication = async (applicationId) => {
    // e.preventDefault();
    axios
      .delete(`http://localhost:5000/applications/${applicationId}`)
      .then((res) => {
        // console.log(status);
        // console.log(index);
        window.alert("Application is deleted.");
        window.location.href = `/executive/manage-applicant`;
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            padding="default"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rows, index) => {
                  const date = new Date(rows?.applicationDate);
                  const today = date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <>
                      <TableRow hover key={rows?._id}>
                        <TableCell align="center">
                          {rows?.applicant?.name}
                        </TableCell>
                        <TableCell align="center">
                          {rows?.applicant?.email}
                        </TableCell>
                        <TableCell align="center">
                          {rows?.applicant?.contact}
                        </TableCell>
                        <TableCell align="center">{today}</TableCell>
                        <TableCell align="center">
                          {rows?.applicationStatus}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            key={rows._id}
                            color="primary"
                            onClick={() => handleClickOpen(rows._id, rows?.applicationStatus, rows?.applicant?.email)}
                          >
                            {" "}
                            Details
                          </Button>
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"Candidate Details"}
                            </DialogTitle>
                            <DialogContent>
                              <p>Please select your option</p>
                              <Button>View Resume/CV</Button>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => handleShortlist(details, "Shortlisted", quota, job_id)}
                                variant="success"
                              >
                                Shortlist
                              </Button>
                              <Button
                                onClick={() => handleShortlist(details, "Rejected", quota, job_id)}
                                variant="warning"
                              >
                                Not Shortlist
                              </Button>
                              <Button
                                onClick={() => handleShortlist(details, "Idle")}
                                variant="secondary"
                              >
                                Idle
                              </Button>
                              {stat === "Rejected" && (
                                <Button onClick={() => deleteApplication(details)} variant="danger"> Delete </Button>
                              )}
                              {stat === "Rejected" && (
                                <Button  variant="success"><Link href={`mailto:${mail}?subject=${subject}&body=${fail}`} underline="none" color="#FFFFFF">Email applicant</Link>  </Button>
                              )}
                              {stat === "Shortlisted" && (
                                <Button  variant="success"><Link href={`mailto:${mail}?subject=${subject}&body=${body}`} underline="none" color="#FFFFFF">Email applicant</Link>  </Button>
                              )}
                              <Button onClick={handleClose}>Close</Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

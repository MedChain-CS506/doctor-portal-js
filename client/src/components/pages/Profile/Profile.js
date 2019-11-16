/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';


import EditIcon from '@material-ui/icons/Edit';
import ContactsIcon from '@material-ui/icons/Contacts';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { Link, Redirect } from 'react-router-dom'

import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  Divider,
  Hidden,
  TextField,
  Tooltip,
  IconButton
} from '@material-ui/core/';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import PatientContext from '../../../context/patient/PatientContext';
import WcIcon from '@material-ui/icons/Wc';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';

const useStyles = makeStyles(theme => ({
  layout: {
    flexGrow: 1,
    width: 'auto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  basicInfo: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },

  divider: {
    marginBottom: theme.spacing(3),
  },

  prescriptionsAndFiles: {
    marginBottom: theme.spacing(6),
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
  },

  buttonIcon: {
    marginRight: theme.spacing(1),
  },

  patientFormIcon: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: 'red',
    color: 'white',
  },
}));

const Profile = ({ signedIn = false, contract, match }) => {
  const classes = useStyles();
  if (!signedIn) return <Redirect to="/not-found" />;

  // const patientContext = useContext(PatientContext);
  // const [patientData, setPatientData] = useState({
  //   aadhaar: 0,
  //   name: '',
  //   sex: '',
  //   dob: '',
  //   weight: 0,
  //   allergies: '',
  // });

  // useEffect(() => {
  //   const asyncCallToGetPatient = async () => {
  //     const data = await patientContext.getPatient(contract, match.params.id);
  //     setPatientData(data);
  //   };
  //   asyncCallToGetPatient();
  // }, [contract, match.params.id, patientContext, patientData]);

  //! This will be for the data that is coming from the contract
  const [patientData, setPatientData] = useState({
    aadhaar: '000011112222',
    name: 'Satoshi Nakamoto',
    sex: 'Male',
    dob: '10/10/10',
    weight: '100',
    //allergies: '',
  });

  //! Use this varibale for setting values within the profile
  const [showingField, setShowingField] = useState('')
  const [initialAadhaar, setInitialAadhaar] = useState('')
  const [initialName, setInitialName] = useState('')
  const [initialSex, setInitialSex] = useState('')
  const [initialDob, setInitialDob] = useState('')
  const [initialWeight, setInitialWeight] = useState('')

  //* showField determines if you are currently editting the field
  const showField = (fieldId) => {
    if (!fieldId) return;
    setShowingField(fieldId)
  }

  const hideFields = (callback) => {
    setShowingField(''),
    setInitialAadhaar(''),
    setInitialName(''),
    setInitialSex(''),
    setInitialDob(''),
    setInitialWeight('')
    //! Might not need this below
    if (callback && typeof callback === 'function') {
      callback();
    }
  };

  //* change functions will change the contract state 
  //* (i.e. patient's aadhar, name, sex, dob, weight)
  const changeAadhaar = () => {
    if (initialAadhaar === patientData.aadhaar) return
    setPatientData({...patientData, aadhaar: initialAadhaar })
  }

  const changeName = () => {
    if (initialName === patientData.name) return
    setPatientData({...patientData, name: initialName })
  }

  const changeSex = () => {
    if (initialSex === patientData.sex) return
    setPatientData({...patientData, sex: initialSex })
  }

  const changeDob = () => {
    if (initialDob === patientData.dob) return
    setPatientData({...patientData, dob: initialDob })
  }

  const changeWeight = () => {
    if (initialWeight === patientData.weight) return
    setPatientData({...patientData, weight: initialWeight })
  }

  //* Depending on the fieldId, changeField will call the functions above
  const changeField = (fieldId) => {
    switch (fieldId) {
      case 'aadhaar':
        changeAadhaar();
        return;

      case 'name':
        changeName();
        return;

      case 'sex':
        changeSex();
        return;

      case 'dob':
        changeDob();
        return;

      case 'weight':
        changeWeight();
        return;

      default:
        return;
    }
  };

  const handleKeyDown = (event, fieldId) => {
    if (!event || !fieldId) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const key = event.key;
    if (!key) return;

    if (key === 'Escape') {
      hideFields();
    } else if (key === 'Enter') {
      changeField(fieldId);
      hideFields();
    }
  };

  //* handleChange functions will change the initial state
  const handleAadhaarChange = (event) => {
    if (!event) return;
    const newAadhaar = event.target.value;
    setInitialAadhaar(newAadhaar)
  }

  const handleNameChange = (event) => {
    if (!event) return;
    const newName = event.target.value;
    setInitialName(newName)
  }

  const handleSexChange = (event) => {
    if (!event) return;
    const newSex = event.target.value;
    setInitialSex(newSex)
  }

  const handleDobChange = (event) => {
    if (!event) return;
    const newDob = event.target.value;
    setInitialDob(newDob)
  }

  const handleWeightChange = (event) => {
    if (!event) return;
    const newWeight = event.target.value;
    setInitialWeight(newWeight)
  }

  return (
    <>
      <main className={classes.layout}>
          <Paper className={classes.basicInfo}>
            
            <Typography variant="h3" align="center" gutterBottom>
              {patientData.name}
            </Typography>

            <Divider className={classes.divider} />


            <List disablePadding>
              <ListItem>
                <Hidden xsDown>
                  <ListItemIcon>
                    <ContactsIcon />
                  </ListItemIcon>
                </Hidden>

                {showingField === 'aadhaar' && 
                  <TextField
                    autoComplete="given-aadhaar"
                    autoFocus
                    fullWidth
                    helperText={'Press Enter to change aadhaar'}
                    label="Aadhaar"
                    placeholder={patientData.aadhaar}
                    required
                    //type="number"
                    value={initialAadhaar}
                    variant="filled"
                    onBlur={hideFields}
                    // ^ when a user leaves the input field
                    onKeyDown={(event) => handleKeyDown(event, 'aadhaar')}
                    onChange={handleAadhaarChange}
                  />
                }

                {showingField !== 'aadhaar' && 
                <>
                  <ListItemText primary="Aadhaar" secondary={patientData.aadhaar} />
                  <ListItemSecondaryAction>
                    {patientData.aadhaar && 
                      <Tooltip title="Edit">
                        <div>
                          <IconButton onClick={() => showField('aadhaar')}>
                            <EditIcon />
                          </IconButton>
                        </div>
                      </Tooltip>
                    }
                  </ListItemSecondaryAction>
                </>
                }

              </ListItem>

              <ListItem>
                <Hidden xsDown>
                  <ListItemIcon>
                    <WcIcon />
                  </ListItemIcon>
                </Hidden>

                {showingField === 'sex' && 
                  <TextField
                    autoComplete="given-aadhaar"
                    autoFocus
                    fullWidth
                    helperText={'Press Enter to change sex'}
                    label="Sex"
                    placeholder={patientData.sex}
                    required
                    //type="number"
                    value={initialSex}
                    variant="filled"
                    onBlur={hideFields}
                    // ^ when a user leaves the input field
                    onKeyDown={(event) => handleKeyDown(event, 'sex')}
                    onChange={handleSexChange}
                  />
                }

                {showingField !== 'sex' && 
                <>
                  <ListItemText primary="Sex" secondary={patientData.sex} />
                  <ListItemSecondaryAction>
                    {patientData.sex && 
                      <Tooltip title="Edit">
                        <div>
                          <IconButton onClick={() => showField('sex')}>
                            <EditIcon />
                          </IconButton>
                        </div>
                      </Tooltip>
                    }
                  </ListItemSecondaryAction>
                </>
                }
              </ListItem>


              <ListItem>
                <Hidden xsDown>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                </Hidden>

                {showingField === 'dob' && 
                  <TextField
                    autoComplete="given-dob"
                    autoFocus
                    fullWidth
                    helperText={'Press Enter to change date of birth'}
                    label="Date of Birth"
                    placeholder={patientData.dob}
                    required
                    //type="number"
                    value={initialDob}
                    variant="filled"
                    onBlur={hideFields}
                    // ^ when a user leaves the input field
                    onKeyDown={(event) => handleKeyDown(event, 'dob')}
                    onChange={handleDobChange}
                  />
                }

                {showingField !== 'dob' && 
                <>
                  <ListItemText primary="Date of Birth" secondary={patientData.dob} />
                  <ListItemSecondaryAction>
                    {patientData.dob && 
                      <Tooltip title="Edit">
                        <div>
                          <IconButton onClick={() => showField('dob')}>
                            <EditIcon />
                          </IconButton>
                        </div>
                      </Tooltip>
                    }
                  </ListItemSecondaryAction>
                </>
                }
              </ListItem>

              <ListItem>
                <Hidden xsDown>
                  <ListItemIcon>
                    <AccessibilityNewIcon />
                  </ListItemIcon>
                </Hidden>

                {showingField === 'weight' && 
                  <TextField
                    autoComplete="given-weight"
                    autoFocus
                    fullWidth
                    helperText={'Press Enter to change weight'}
                    label="Weight"
                    placeholder={patientData.weight}
                    required
                    //type="number"
                    value={initialWeight}
                    variant="filled"
                    onBlur={hideFields}
                    // ^ when a user leaves the input field
                    onKeyDown={(event) => handleKeyDown(event, 'weight')}
                    onChange={handleWeightChange}
                  />
                }

                {showingField !== 'weight' && 
                <>
                  <ListItemText primary="Weight" secondary={patientData.weight} />
                  <ListItemSecondaryAction>
                    {patientData.weight && 
                      <Tooltip title="Edit">
                        <div>
                          <IconButton onClick={() => showField('weight')}>
                            <EditIcon />
                          </IconButton>
                        </div>
                      </Tooltip>
                    }
                  </ListItemSecondaryAction>
                </>
                }
              </ListItem>
              

            </List>

            {/* <Grid container spacing={4}>
              <Grid id="aadhaar" item xs={12}>
                <Typography variant="h5">
                  Aadhaar - {patientData.aadhaar}
                </Typography>
              </Grid>
              <Grid id="date-of-birth" item xs={12}>
                <Typography variant="h5">
                  Date of Birth - {patientData.dob}
                </Typography>
              </Grid>
              <Grid id="sex" item xs={12}>
                <Typography variant="h5">Sex - {patientData.sex}</Typography>
              </Grid>
              <Grid id="weight" item xs={12}>
                <Typography variant="h5">
                  Weight - {patientData.weight}
                </Typography>
              </Grid>
              <Grid id="known-allergies" item xs={12}>
                <Typography variant="h5">
                  Known Allergies - {patientData.allergies}
                </Typography>
              </Grid>
              <Grid id="known-diseases" item xs={12}>
                <Typography variant="h5">Known Diseases - </Typography>
              </Grid>
            </Grid> */}
          </Paper>

          {/* <Grid id="prescriptions" item xs={12} sm={6}>
            <Paper className={classes.prescriptionsAndFiles}>
              <Typography variant="h4">Prescriptions</Typography>
            </Paper>
            <Link to="/prescriptions">
              <Fab
                data-testid="prescription-button"
                className={classes.patientFormIcon}
                variant="extended"
              >
                <AddCircleIcon className={classes.buttonIcon} /> New
                Prescription Button
              </Fab>
            </Link>
          </Grid>

          <Grid id="medical-files" item xs={12} sm={6}>
            <Paper className={classes.prescriptionsAndFiles}>
              <Typography variant="h4">Medical Files</Typography>
            </Paper>
          </Grid> */}
        {/* </Grid> */}
      </main>
    </>
  );
};

export default Profile;

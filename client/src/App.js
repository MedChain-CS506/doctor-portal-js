import React, { useState, useEffect } from 'react';

//* React Router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//* MUI / Styles
import { CssBaseline, Snackbar, ThemeProvider } from '@material-ui/core';
import readingTime from 'reading-time';
import { lightTheme, darkTheme } from './utils/theme';
import './index.css';

//* Context
import PatientState from './context/patient/PatientState';

//* Layout
import Loading from './components/layout/Loading';
import DialogHost from './components/layout/Dialog/DialogHost';
import Navbar from './components/layout/Navbar';

//* Pages
import Landing from './components/pages/Landing';
import NotFound from './components/pages/NotFound';
import Profile from './components/pages/Profile';
import RequestAccess from './components/pages/RequestAccess';

//* Blockchain
import getWeb3 from './utils/getWeb3.js';
import MedChainContract from './contracts/MedChain.json';

async function docCheck(contract) {
  let result = 10;
  try {
    await contract.contract.methods
      .is_doctor_or_pharmacist()
      .call({
        from: contract.accounts[0],
      })
      .then(res => {
        result = res;
      });
    return result;
  } catch (err) {
    console.log("Can't connect to blockchain");
    return 2;
  }
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [contract, setContract] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [dialog, setDialog] = useState({
    patientFormDialog: false,
    prescriptionFormDialog: false,
    fileDialog: false,
  });
  const [snackbar, setSnackbar] = useState({
    autoHideDuration: 0,
    message: '',
    open: false,
  });

  const toggleSnackbar = (message, autoHideDuration = 2) =>
    setSnackbar({
      autoHideDuration: readingTime(message).time * autoHideDuration,
      message,
      open: true,
    });

  useEffect(() => {
    async function connectMetamask() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MedChainContract.networks[networkId];
        const instance = new web3.eth.Contract(
          MedChainContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        const data = {
          accounts,
          web3,
          contract: instance,
        };
        setContract(data);
        setSignedIn(true);
        setReady(true);
        return data;
      } catch (error) {
        setSignedIn(false);
        setReady(false);
        console.error(error);
      }
    }

    connectMetamask().then(data => {
      docCheck(data).then(res => {
        // eslint-disable-next-line eqeqeq
        if (res == 0) {
          setIsDoctor(true);
          // eslint-disable-next-line eqeqeq
        } else if (res == 1) {
          setIsPharmacist(true);
        }
      });
      setInterval(async () => {
        try {
          const rn = await data.web3.eth.getAccounts();
          if (rn[0] !== data.accounts[0]) {
            setSignedIn(false);
          } else if (rn[0] === data.accounts[0]) {
            setSignedIn(true);
          }
        } catch (err) {
          console.log(err);
        }
      }, 100);
    });
  }, [signedIn, isDoctor, isPharmacist]);

  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleTheme = () => setIsLightTheme(!isLightTheme);

  if (isDoctor) {
    return (
      <PatientState>
        <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
          <CssBaseline />
          {ready ? (
            <>
              <Router>
                <Navbar
                  theme={isLightTheme ? lightTheme : darkTheme}
                  handleToggleTheme={() => toggleTheme()}
                />
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={props => (
                      <Landing
                        {...props}
                        signedIn
                        isDoctor
                        onNewPatientClick={() =>
                          setDialog({ ...dialog, patientFormDialog: true })
                        }
                      />
                    )}
                  />

                  <Route
                    exact
                    path="/profile/:id"
                    render={props => (
                      <Profile
                        {...props}
                        signedIn
                        isDoctor
                        contract={contract}
                        onNewPrescriptionClick={() =>
                          setDialog({ ...dialog, prescriptionFormDialog: true })
                        }
                        onNewFileClick={() =>
                          setDialog({ ...dialog, fileDialog: true })
                        }
                      />
                    )}
                  />
                  <Route component={NotFound} />
                </Switch>
              </Router>

              <DialogHost
                dialogs={{
                  patientFormDialog: {
                    dialogProps: {
                      open: dialog.patientFormDialog,
                      contract,
                      onClose: () =>
                        setDialog({ ...dialog, patientFormDialog: false }),
                    },
                    props: {
                      toggleSnackbar,
                    },
                  },

                  prescriptionFormDialog: {
                    dialogProps: {
                      open: dialog.prescriptionFormDialog,
                      contract,
                      aadhaar: null,
                      onClose: () =>
                        setDialog({ ...dialog, prescriptionFormDialog: false }),
                    },
                    props: {
                      toggleSnackbar,
                    },
                  },

                  fileDialog: {
                    dialogProps: {
                      open: dialog.fileDialog,
                      contract,
                      onClose: () =>
                        setDialog({ ...dialog, fileDialog: false }),
                    },
                    props: {
                      toggleSnackbar,
                    },
                  },
                }}
              />

              <Snackbar
                autoHideDuration={snackbar.autoHideDuration}
                message={snackbar.message}
                open={snackbar.open}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              />
            </>
          ) : (
            <Loading />
          )}
        </ThemeProvider>
      </PatientState>
    );
  }
  if (isPharmacist) {
    return (
      <PatientState>
        <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
          <CssBaseline />
          {ready ? (
            <Router>
              <Navbar
                isPharmacist
                theme={isLightTheme ? lightTheme : darkTheme}
                handleToggleTheme={() => toggleTheme()}
              />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => <Landing {...props} signedIn isPharmacist />}
                />

                <Route
                  exact
                  path="/profile/:id"
                  render={props => (
                    <Profile
                      {...props}
                      signedIn
                      contract={contract}
                      isPharmacist
                    />
                  )}
                />
                <Route component={NotFound} />
              </Switch>
            </Router>
          ) : (
            <Loading />
          )}
        </ThemeProvider>
      </PatientState>
    );
  }
  return (
    <PatientState>
      <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
        <CssBaseline />
        {ready ? (
          <Router>
            <Navbar
              theme={isLightTheme ? lightTheme : darkTheme}
              handleToggleTheme={() => toggleTheme()}
            />
            <RequestAccess />
          </Router>
        ) : (
          <Loading />
        )}
      </ThemeProvider>
    </PatientState>
  );
}

export default App;

/* eslint-disable */
import React, { useState, useEffect } from 'react';

//* React Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from './utils/theme';

//* Components
import Navbar from './components/layout/Navbar';
import Loading from './components/layout/Loading';

//* Pages
import Landing from './components/pages/Landing';
import Profile from './components/pages/Profile';
import PatientForm from './components/pages/PatientForm';
import NotFound from './components/pages/NotFound';

//* Context
import PatientState from './context/patient/PatientState';

//* Blockchain
import getWeb3 from './utils/getWeb3.js';
import MedChainContract from './contracts/med_chain.json';

//* Styles
import './index.css';

async function docCheck(contract) {
  let result = 10;
  await contract.contract.methods.is_doctor_or_pharmacist().call({
    from: contract.accounts[0]
  }).then((res) => {
    result = res;
    console.log(res);
  })
  return result;
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [contract, setContract] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });
  const [isDoc, setIsDoc] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);

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
        let data = {
          accounts: accounts,
          web3: web3,
          contract: instance
        };
        console.log(accounts);
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

    connectMetamask().then((data) => {
      docCheck(data).then((res) => {
        console.log("res: " + res);
        if(res == 0){
          setIsDoc(true);
        } else if (res == 1) {
          setIsPharmacist(true);
        } 
      })
      setInterval(async () => {
        const rn = await data.web3.eth.getAccounts();
        if (rn[0] !== data.accounts[0]) {
          setSignedIn(false);
        } else if (rn[0] === data.accounts[0]) {
          setSignedIn(true);
        }
      }, 100)
    });
  }, [signedIn, isDoc, isPharmacist]);

  const toggleTheme = () => {
    const newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light';
    console.log(newPaletteType)
    //changeTheme = newPaletteType;
  };

  const log = () => {
    console.log("isDoc:" +  isDoc);
    console.log("isPhar:" +  isPharmacist);
  }

  return (
    <PatientState>
      { log() }
      <ThemeProvider theme={theme}>
      {ready ? (
        <Router>
          <Navbar handleToggleTheme={() => toggleTheme()} />
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={props => <Landing {...props} signedIn={signedIn} />}
              />
              <Route
                exact
                path="/patient-form"
                render={props => (
                  <PatientForm
                    {...props}
                    signedIn={signedIn}
                    contract={contract}
                  />
                )}
              />
              <Route
                exact
                path="/profile/:id"
                render={props => (
                  <Profile {...props} signedIn={signedIn} contract={contract} />
                )}
              />
              <Route component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </div>
        </Router>
      ) : (
        <Loading />
      )}
      </ThemeProvider>
    </PatientState>
  );
}

export default App;

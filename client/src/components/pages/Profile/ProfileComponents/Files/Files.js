import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
}); // leaving out the arguments will default to these values

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  rootNav: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Files() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [fileHash, setFileHash] = useState(
    'QmWUCkDdcgEVYDntYP6kDGeMvgiQtjuyKJWjHAzJowMXuv'
  );
  const [contract, setContract] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [fileHashUpdated, setFileHashUpdated] = useState(true);
  const [ready, setReady] = useState(false);

  const captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    //! ^ This line above will allow us to convert the file into a buffer
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log('buffer', buffer);
    };
  };

  useEffect(() => {}, [fileHash]);

  // example hash: QmWUCkDdcgEVYDntYP6kDGeMvgiQtjuyKJWjHAzJowMXuv
  // example url: https://ipfs.infura.io/ipfs/QmWUCkDdcgEVYDntYP6kDGeMvgiQtjuyKJWjHAzJowMXuv
  const onSubmit = event => {
    event.preventDefault();
    console.log('Submitting file to ipfs...');

    ipfs.add(buffer, (error, result) => {
      console.log('Ipfs result', result);
      const _fileHash = result[0].hash;

      if (error) {
        console.error(error);
        return;
      }
      //! Now store it (uploads filehash into contract)
      setFileHash(_fileHash);
      console.log(fileHash);
    });
  };

  return (
    <>
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Files
      </Typography>
      <div className={classes.root}>
        <main className={classes.content}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src={`https://ipfs.infura.io/ipfs/${fileHash}`} />
          </a>
          <form onSubmit={onSubmit}>
            <input type="file" onChange={captureFile} />
            <input type="submit" />
          </form>
        </main>
      </div>
    </>
  );
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    maxWidth: '96vw',
    padding: '2vw'
  },
  table: {
    maxWidth: '60vw',
    flexGrow: 2
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    maxWidth: '25vw',
    
  },
  button: {
    marginBottom: '2vh'
  }
});

function createData(id, player) {
  return { id, player };
}

const rows = [
  createData(1, 'Frozen yoghurt'),
  createData(2, 'Ice cream sandwich'),
  createData(3, 'Eclair'),
  createData(4, 'Cupcake'),
  createData(5, 'Gingerbread'),
];

export default function Lobby () {
  const classes = useStyles();

  return (
    <>
      <div className={classes.wrapper}>
        <TableContainer component={Paper} className={classes.table}>
          <Typography variant='h4'>Available matches</Typography>
          <Table aria-label="simple table" data-testid="table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>No.</TableCell>
                <TableCell>Player</TableCell>
                <TableCell align='center'>Play</TableCell>
                <TableCell align='center'>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align='center'>
                    {row.id}
                  </TableCell>
                  <TableCell>{row.player}</TableCell>
                  <TableCell align='center'><Button variant="outlined">Play</Button></TableCell>
                  <TableCell align='center'><Button><ClearIcon /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant='h4'>Invitation from friends</Typography>
          <Table aria-label="simple table" data-testid="table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>No.</TableCell>
                <TableCell>Friend</TableCell>
                <TableCell align='center'>Play</TableCell>
                <TableCell align='center'>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align='center'>
                    {row.id}
                  </TableCell>
                  <TableCell>{row.player}</TableCell>
                  <TableCell align='center'><Button variant="outlined">Play</Button></TableCell>
                  <TableCell align='center'><Button><ClearIcon /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        <div className={classes.buttonContainer} data-testid="buttons">
          <Button variant="outlined" className={classes.button}>Create a new match</Button>
          <Button variant="outlined" className={classes.button}>Play with a friend</Button>
          <Button variant="outlined">Play against computer</Button>
        </div>
      </div>
    </>
  );
}

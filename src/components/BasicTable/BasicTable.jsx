import React, { useState, useEffect } from 'react'
import { subDays } from 'date-fns';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export default function BasicTable() {
  const [orders, setOrders] = useState([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [filters, setFilters] = React.useState();
  const [ordersFrom, setOrdersFrom] = React.useState(subDays(new Date(), 1));
  const [ordersTo, setOrdersTo] = React.useState(new Date());
  const [onlyWithInvoice, setOnlyWithInvoice] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState();

  //getting mock data
  useEffect(() => {
    fetch('/api/orders')
      .then((response) => response.json())
      .then((json) => setOrders(json))
  }, [])
  //changing page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //selecting row
  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const addFilters = () => {
    setFilters({
      ordersFrom: ordersFrom,
      ordersTo: ordersTo,
      onlyWithInvoice: onlyWithInvoice,
      searchTerm: searchTerm
    })
    //this will usualy trigger request to backend after some formating of the data.
  }

  const clearFilters = () => {
    setOrdersFrom(subDays(new Date(), 1))
    setOrdersTo(new Date())
    setOnlyWithInvoice(false)
    setSearchTerm()
    setFilters()
  }

  //setting pagination pages
  const visibleOrders = React.useMemo(
    () => {
      //this will usualy be backend
      const filteredOrders = filters ? orders.filter((order) => order.invoice == onlyWithInvoice) : orders

      return filteredOrders.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      )},
    [page, rowsPerPage, orders, filters]
  );

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const deleteSelectedOrders = () => {
    alert(`deleting ${selected.length} orders`)
  }

  return (

    <TableContainer component={Paper}>
    <Paper>
      <Input
        sx={{
          margin: 2
        }}
        startAdornment={
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        }
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label='From: '
          onChange={(newValue) => setOrdersFrom(newValue)}
          sx={{
            margin: 2
          }}
          maxDate={ordersTo}
        />
        <DatePicker
          label='To: '
          onChange={(newValue) => setOrdersTo(newValue)}
          sx={{
            margin: 2
          }}
        />
        <FormControlLabel
            sx={{
              marginTop: 3
            }}
            control={
              <Checkbox
                checked={onlyWithInvoice}
                onChange={(event) => setOnlyWithInvoice(event.target.checked)}
              />
            }
            label='With Invoice'
        />
        <Button
          variant='outlined'
          onClick={addFilters}
          sx={{
            marginTop: 3,
            marginRight: 2,
            float: 'right'
          }}
        >
          Add Filters
        </Button>
      </LocalizationProvider>
      </Paper>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{selected.length > 0  && (
              <IconButton onClick={deleteSelectedOrders} aria-label='delete' size='small'>
                <DeleteIcon fontSize='inherit' />
              </IconButton>
              )}
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell align='right'>Name</TableCell>
            <TableCell align='right'>Sum</TableCell>
            <TableCell align='right'>Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleOrders.map((order) => {
            const isItemSelected = isSelected(order.id);
            return (
              <TableRow
                key={order.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
                onClick={(event) => handleRowClick(event, order.id)}
                role='checkbox'
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={order.id}
                selected={isItemSelected}
                sx={{ cursor: 'pointer' }}
              >
               <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    checked={isItemSelected}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  {order.id}
                </TableCell>
                <TableCell align='right'>{order.name}</TableCell>
                <TableCell align='right'>$ {order.price}</TableCell>
                <TableCell align='right'>{order.invoice ? <CheckIcon></CheckIcon> : <NotInterestedIcon></NotInterestedIcon>}</TableCell>
              </TableRow>
            )

          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Button
        onClick={clearFilters}
        sx={{
          marginTop: 3,
          marginRight: 2,
          float: 'right'
        }}
      >
        Clear Filters
      </Button>
    </TableContainer>
  );
}

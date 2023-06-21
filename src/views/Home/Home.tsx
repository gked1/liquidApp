import { useEffect, useState, ChangeEvent, FC } from 'react';
import { fetchData, getComparator, HeadCells } from './utils';
import { Beer } from '../../types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Checkbox, Paper, TextField, Link, TablePagination, Box,  IconButton, useTheme, TableRow, Typography, TableCell, TableHead, TableBody, TableContainer, TableSortLabel, Grid, FormControlLabel, Tooltip
} from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material//KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import styles from './Home.module.css';

/**
 * Paginated, sorted and filtered table with favourite liquids
 * @component 
 */

const Home: FC = () => {
  
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [filteredBeerList, setFilteredBeerList] = useState<Array<Beer>>([]);
  const [tablePage, setTablePage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchedBeerName, setSearchedBeerName] = useState<string>('');
  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('id');
  const [addToFavouritesFilterState, setAddToFavouritesFilterState] = useState<Array<Beer>>([]);
  const [triggerCheckbox, setTriggerCheckbox] = useState<boolean>(false);
  const [showFavouritesOnlyCheckbox, setShowFavouritesOnlyCheckbox] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const initializeAttributesForItemsAddedToFavourites = () => {
    setAddToFavouritesFilterState([]);
    if (beerList.length !== 0) {
        beerList.map((item: Beer) => {
          setAddToFavouritesFilterState(oldArray => [...oldArray, {...item, isFavourite: false}])
        })
    }
  }

  const checkIfSearchedValueExists = (object: string, value: string) => {
    let tempState = 0;
    if (value === '' || value === undefined || value === null || object === undefined || object === null) return true;
    const name = object;
    if (name.toString().toLowerCase().includes(value.toString().toLowerCase())) tempState++;
    return tempState > 0;
  }

  const createSetFilteredBeerList: unknown = () => { /* Create beerList-based set prepared for further filtering */
    setFilteredBeerList([])
      return (
      beerList
        .filter((item: Beer) => (searchedBeerName !== '') ? checkIfSearchedValueExists(item.name, searchedBeerName) : item) // .filter(item => searchedBeerId !== '' ? item.id === searchedBeerId : item)
        .filter((item: Beer) => showFavouritesOnlyCheckbox 
          ? localStorage?.getItem(`addToFavouritesFilterState_${item?.id}`) && JSON.parse(String(localStorage?.getItem(`addToFavouritesFilterState_${item?.id}`))).isFavourite
          : item)
        .map(item => {
          setFilteredBeerList(oldArray => [...oldArray, item])
        })
    )
  }

  const renderSearchTool = () => {
    return (
      <Grid container spacing={1} style={{padding: '0 4px 8px 4px', alignItems: 'center', justifyItems: 'space-between'}}>
        <Grid item xs style={{minWidth: '260px'}}>
          <TextField
            value={searchedBeerName}
            onChange={handleSearchedBeerNameChange}
            label='Filter by name'
            name="searchedBeerName"
            variant='outlined' // InputLabelProps={{ shrink: shrinkSearchedBeerName }}
            InputProps={{
              endAdornment: searchedBeerName && (
                <ClearIcon
                  style={{
                    color: 'rgba(0, 0, 0, 0.54)',
                    opacity: .7,
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSearchedBeerName('')}}
                />
              )
            }}
          />
        </Grid>
        <Grid item xs style={{padding: '4px 0', textAlign: 'right', minWidth: 'fit-content'}}>
          <Grid container style={{alignItems: 'center', justifyItems: 'flex-end'}}>
            <FormControlLabel
              label=""
              control={
                <span style={{color: '#0052A5', textAlign: 'end'}}>
                  <Checkbox
                    name="showFavouritesOnlyCheckbox"
                    value={showFavouritesOnlyCheckbox}
                    checked={showFavouritesOnlyCheckbox}
                    onChange={() => setShowFavouritesOnlyCheckbox(!showFavouritesOnlyCheckbox)}
                    color="primary"
                    style={{padding: '0 9px 0 0'}}
                  />
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      display: 'inline'
                    }}
                  >
                    Show favourites
                  </div>
                </span>
              }
              style={{marginRight: '8px'}}
            />
          </Grid>
        </Grid>
        <Grid item xs>
          <Tooltip          
            title='Refresh table'
            arrow placement="top"
          >
            <AutorenewIcon
              onClick={() => setReload(!reload)}
              color= 'primary'
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </Grid>
      </Grid>
    )
  }

  const headCells = [
    { id: 'isFavourite', numeric: false, disablePadding: true, label: 'Favourite' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'city', numeric: false, disablePadding: true, label: 'City' },
    { id: 'state', numeric: false, disablePadding: true, label: 'State' },
    { id: 'postal_code', numeric: false, disablePadding: true, label: 'Postal code' },
    { id: 'country', numeric: false, disablePadding: true, label: 'Country' }
  ];

  function EnhancedTableHead (
    {
      order,
      orderBy,
      onRequestSort,
      headCells
    }: {
      order: 'asc' | 'desc',
      orderBy: string,
      onRequestSort: (event: ChangeEvent<HTMLInputElement>, property: string) => void,
      headCells: Array<HeadCells>
    }
  ) {
    const createSortHandler = (property: unknown) => (event: unknown) => {
      onRequestSort(event as ChangeEvent<HTMLInputElement>, property as string);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map(headCell => (
            <TableCell
              key={headCell?.id}
              align='center'
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id
                  ?
                    <span
                      style={{
                        border: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1,
                        overflow: 'hidden', padding: 0, position: 'absolute',
                        top: 20, width: 1
                      }}
                    >
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  : null
                }
              </TableSortLabel>
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  const renderTableRows = () => {
    return (
      <>
        {filteredBeerList.length === 0
          ?
            <TableRow>
              <TableCell style={{textAlign: "center"}} colSpan={12}>
                <Typography component={'span'} style={{fontWeight: '500', color: '#999'}}>
                  No items, check filters
                </Typography>
              </TableCell>
            </TableRow>  
          : filteredBeerList
            .slice().sort(getComparator(order, orderBy)) //modern browsers
            .slice(tablePage * rowsPerPage, tablePage * rowsPerPage + rowsPerPage)
            .map((beer: Beer, index: number) => (
              <TableRow key={index.toString()}> {/* id={beer?.name.toString()} */}
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Checkbox
                    checked={
                      localStorage?.getItem(`addToFavouritesFilterState_${beer?.id}`) && JSON.parse(String(localStorage?.getItem(`addToFavouritesFilterState_${beer?.id}`))).isFavourite
                    }
                    onChange={event => handleAddToFavouritesCheckbox(event, beer.id)}
                  />
                </TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Link component={RouterLink} to={`/beer/${beer?.id}`}>
                    {beer?.name}
                  </Link>
                </TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Link component={RouterLink} to={`/beer/${beer?.id}`}>
                    {beer?.city}
                  </Link>
                </TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Link component={RouterLink} to={`/beer/${beer?.id}`}>
                    {beer?.state}
                  </Link>
                </TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Link component={RouterLink} to={`/beer/${beer?.id}`}>
                    {beer?.postal_code}
                  </Link>
                </TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Link component={RouterLink} to={`/beer/${beer?.id}`}>
                    {beer?.country}
                  </Link>
                </TableCell>
              </TableRow>
            ))
        }
      </>
    )
  }

  function renderTablePaginationTool() {
    return (
      <TablePagination
        style={{
          margin: '0 auto', display: 'flex', outline: '4px solid #fff', border: '2px solid #fff', marginTop: '5px',
          justifyContent: 'center', color: '#0052A5'
        }}
        labelDisplayedRows={
          item => `Page ${item.page + 1} of ${filteredBeerList.length === 0 ? 1 : Math.floor((filteredBeerList.length !== 0 ? filteredBeerList.length : 0) / rowsPerPage + (beerList.length !== 0 && filteredBeerList.length % rowsPerPage === 0 ? 0 : 1))}`
        }
        labelRowsPerPage="Items per page"
        rowsPerPageOptions={[1, 3, 5, 10]}
        component="div"
        count={filteredBeerList.length !== 0 ? filteredBeerList.length : 10}
        rowsPerPage={rowsPerPage}
        page={tablePage}
        onPageChange={handleChangePage as () => void}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions as FC}
      />
    )
  }

  const TablePaginationActions = (
    {
      count,
      page,
      rowsPerPage
    }: {
      count: number,
      page: number,
      rowsPerPage: number
    }
  ) => {
    const theme = useTheme();
    
    const handleFirstPageButtonClick = () => {
      handleChangePage(0);
    };
    const handleBackButtonClick = () => {
      handleChangePage(page - 1);
    };
    const handleNextButtonClick = () => {
      handleChangePage(page + 1);
    };
    const handleLastPageButtonClick = () => {
      handleChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }} style={{minWidth: 'max-content'}}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
          color="primary"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
          color="primary"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
          color="primary"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
            color="primary"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  /* Handlers */

  const handleSearchedBeerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchedBeerName(e.target.value)
  }

  const handleChangePage = (newPage: number) => {
    setTablePage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setTablePage(0);
  };

  const handleAddToFavouritesCheckbox = (e: ChangeEvent<HTMLInputElement>, beerId: unknown) => {
    if (!e.target.checked) {
      let updatedItem = addToFavouritesFilterState.filter((item: Beer) => item.id === beerId).map(item => item);
      localStorage.setItem(`addToFavouritesFilterState_${beerId}`, JSON.stringify(Object.assign({}, updatedItem, {isFavourite: false })));
      setTriggerCheckbox(!triggerCheckbox);
    } else {
      let updatedItem = addToFavouritesFilterState.filter((item: Beer) => item.id === beerId).map(item => item);
      localStorage.setItem(`addToFavouritesFilterState_${beerId}`, JSON.stringify(Object.assign({}, updatedItem, {isFavourite: true })));
      setTriggerCheckbox(!triggerCheckbox);
    }
  }

  const handleRequestSort = (event: ChangeEvent<HTMLInputElement>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* Effects */

  useEffect(
    fetchData.bind(this, setBeerList)
  , [reload])

  useEffect(() => {
    initializeAttributesForItemsAddedToFavourites();
  }, [beerList])

  // useEffect(() => {  /* Initialize filteredBeerList */
  //   setBeerList(createSetFilteredBeerList)
  // }, [beerList])

  useEffect(() => {  /* Update filteredBeerList depending on applied filters */
    setFilteredBeerList(createSetFilteredBeerList as Beer[]);
    setTablePage(0);
  }, [beerList, searchedBeerName, showFavouritesOnlyCheckbox, reload]) //searchedBeerId

  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div style={{padding: '5px 10px 40px 0'}}>
                {renderSearchTool()}
              </div>
                <TableContainer style={styles.tableContainer}>
                  <EnhancedTableHead
                    order={order as 'asc' | 'desc'} // numSelected={beerList.length} rowCount={beerList.length}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={headCells as Array<HeadCells>}
                  />
                  <TableBody>{renderTableRows()}</TableBody>
                </TableContainer>
                {renderTablePaginationTool()}
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;

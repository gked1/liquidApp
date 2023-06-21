import { getRandomBeerList } from '../../api';
import { Beer } from '../../types';
import handle from '../../utils/error';

const fetchData = (
  setData: (data: Array<Beer>) => void
) => {
  (async () => {
    try {
      const { data } = await getRandomBeerList(100);
      setData(data);
    } catch (error) {
      handle(error);
    }
  })();
};

function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: unknown, b: unknown) => descendingComparator(a, b, orderBy)
    : (a: unknown, b: unknown) => -descendingComparator(a, b, orderBy);
}

// function stableSort(array: unknown, comparator: unknown) {
//   const stabilizedThis = array.map((el: unknown, index: unknown) => [el, index]);
//   stabilizedThis.sort((a: unknown, b: unknown) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el: unknown) => el[0]);
// }

type HeadCells = {
  id: 'isFavourite',
  numeric: false,
  disablePadding: true,
  label: 'Favourite'
};

export { fetchData, getComparator };
export type { HeadCells };

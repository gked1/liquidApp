import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Offline from '../views/Offline';
import Home2 from '../views/Home2';
import NotFound from '../views/404';
import BeerList from '../views/BeerList';
import Beer from '../views/Beer';
import Footer from '../components/Footer';
import Menu from '../components/Menu';

const Router = () => (
  <BrowserRouter>
    <Menu>
      <Offline />
      <Routes>
        <Route index element={<Home2 />} />
        <Route path='beer'>
          <Route index element={<BeerList />} />
          <Route path=':id' element={<Beer />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </Menu>
  </BrowserRouter>
);

export default Router;

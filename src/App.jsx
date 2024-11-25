import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {Dashboard} from './pages/Dashboard';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
import ProtectedRoute from './components/ProtectedRoute';
import { UserAuthContextProvider } from './context/UserAuthContext';

function App() {
  return (
    <BrowserRouter>
        <UserAuthContextProvider>
          <Routes>
            <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index exact={true} element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
              <Route path='/products' exact={true} element={<ProtectedRoute><Products/></ProtectedRoute>}/>
              <Route path='/addproduct' exact={true} element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
              <Route path='/orders' exact={true} element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
            </Route>
            <Route path='/login' exact={true} element={<Login/>}/>
            <Route path='*' exact={true} element={<NotFoundPage />}/>
          </Routes>
        </UserAuthContextProvider>
    </BrowserRouter>
  )
}
export default App;
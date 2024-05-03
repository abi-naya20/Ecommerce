import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Home from './components/home.js';
import Category from './components/categories.js';
import Admin from './components/Admin.js';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/categories' element={<Category/>}></Route>
      <Route path='/admin' element={<Admin/>}></Route>
    </Routes>
  );
}
export default App;
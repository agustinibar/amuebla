import { Route, Routes } from 'react-router-dom';
import { Landing } from './views/Landing/Landing';
import { Home } from './views/Home/Home';
import { Detail } from './views/Detail/Detail';
import { Dashboard } from './views/Dashboard/Dashboard';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/detail/:id' element={<Detail/>}/>
    </Routes>
    </>
  );
}

export default App;

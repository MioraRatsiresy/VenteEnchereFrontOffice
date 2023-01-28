import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginClient from './components/LoginClient';
import Accueil from './components/Accueil';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>      
        <Routes>
          <Route path='/' element={<LoginClient/>} />
          <Route path='/accueil' element={<Accueil/>} />
        </Routes>
    
      </BrowserRouter>
     
    </div>
  );
}

export default App;

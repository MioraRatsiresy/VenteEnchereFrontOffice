import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Accueil from './components/Accueil';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>      
        <Routes>
          <Route path='/' element={<Accueil/>} />
          <Route path='/accueil' element={<Accueil/>} />
        </Routes>
    
      </BrowserRouter>
     
    </div>
  );
}

export default App;

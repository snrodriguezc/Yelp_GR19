import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SimpleLayout from './layouts/simpleLayout'

function App() {
  return (
    <>
    
      <Router>
        <Routes>
          <Route path='/' element={ <SimpleLayout/>} />
        </Routes>
      </Router>
    
    </>
  );
}

export default App;

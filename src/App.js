import logo from "./logo.svg";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import IDCardGenerator from "./pages/Home";
import IDCardDisplay from "./pages/User";



function App() {

  return (
    // <LocomotiveScrollProvider options={options} containerRef={ref}>
      <Routes>
      
        <Route path="/" 
        element={<IDCardGenerator />}
         />
        <Route path="/user/:id" 
        element={<IDCardDisplay />}
         />
       
      </Routes>
     
  );
}

export default App;

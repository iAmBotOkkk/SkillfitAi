
import { Routes , Route } from "react-router-dom";
import { Resume } from "./pages/resume";
import { HomePage } from "./pages/home";
import { Navbar } from "./components/Navbar";

 
function App() {
  return (
  <div>
  <Navbar/>
  <Routes>
    <Route path="/" element ={<HomePage/>} />
    <Route path="/uploadResume" element ={<Resume/>} />
  </Routes>
    </div>
  )
}
 
export default App;



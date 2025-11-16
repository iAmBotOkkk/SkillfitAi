import { Routes , Route } from "react-router-dom";
import {AddResume} from "./pages/resume";
import { HomePage } from "./pages/home";
import { Navbar } from "./components/Navbar";
import toast,{Toaster} from "react-hot-toast";

 
function App() {
  return (
  <div>
  <Navbar/>
  <Routes>
    <Route path="/" element ={<HomePage/>} />
    <Route path="/uploadResume" element ={<AddResume/>} />
  </Routes>
  <Toaster/>
    </div>
  )
}
 
export default App;



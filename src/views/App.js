import logo from './logo.svg';
import './App.scss';
import MyComponent from './Example/MyComponent';
import Navbar from "../components/Navigation/Navbar";
import Articles from "../components/Articles/Articles";
import Footer from "../components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Articles />
      <Footer />
    </div>
  );
}

export default App;

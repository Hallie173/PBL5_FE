import logo from './logo.svg';
import './App.scss';
import MyComponent from './Example/MyComponent';
import Navbar from "../components/Navigation/Navbar";
import Articles from "../components/Articles/Articles";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Articles />
    </div>
  );
}

export default App;

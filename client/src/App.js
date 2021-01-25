import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./components/views/NavBar/NavBar";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Footer from "./components/views/Footer/Footer";

import Auth from "./hoc/auth";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Auth(LandingPage,null)} />
        <Route exact path="/register" component={Auth(RegisterPage,false)} />
        <Route exact path="/login" component={Auth(LoginPage,false)} />
      </Switch>
    </Router>
  );
}

export default App;

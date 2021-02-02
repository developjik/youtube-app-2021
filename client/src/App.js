import { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./components/views/NavBar/NavBar";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";
import Footer from "./components/views/Footer/Footer";

import Auth from "./hoc/auth";

import "./App.css";

import { Spin } from "antd";

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <Spin
            tip="Loading..."
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          ></Spin>
        }
      >
        <NavBar />
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />         
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />     
          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} />                
        </Switch>
        <Footer />
      </Suspense>
    </Router>
  );
}

export default App;

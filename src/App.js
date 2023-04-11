import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function Login(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  
  return <>
    <h2>Login</h2>

    <div className="form">
      <p><input className="login" type="text" name="username" placeholder="ID" onChange={event => {
        setId(event.target.value);
      }} /></p>
      <p><input className="login" type="password" name="pwd" placeholder="PW" onChange={event => {
        setPassword(event.target.value);
      }} /></p>

      <p><input className="btn" type="submit" value="LOGIN" onClick={() => {
        const userData = {
          userId: id,
          userPassword: password,
        };
        fetch("http://localhost:3001/login", { //auth 주소에서 받을 예정
          method: "post", // method :통신방법
          headers: {      // headers: API 응답에 대한 정보를 담음
            "content-type": "application/json",
          },
          body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
          .then((res) => res.json())
          .then((json) => {            
            if(json.isLogin==="True"){
              props.setMode("WELCOME");
            }
            else {
              alert(json.isLogin)
            }
          });
      }} /></p>
    </div>

    <p>If you don't have account  <button onClick={() => {
      props.setMode("SIGNIN");
    }}>Sign up</button></p>
  </> 
}


function Signin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return <>
    <h2>Sign up</h2>

    <div className="form">
      <p><input className="login" type="text" placeholder="ID" onChange={event => {
        setId(event.target.value);
      }} /></p>
      <p><input className="login" type="password" placeholder="PW" onChange={event => {
        setPassword(event.target.value);
      }} /></p>
      <p><input className="login" type="password" placeholder="PW check" onChange={event => {
        setPassword2(event.target.value);
      }} /></p>

      <p><input className="btn" type="submit" value="Signup" onClick={() => {
        const userData = {
          userId: id,
          userPassword: password,
          userPassword2: password2,
        };
        fetch("http://localhost:3001/signin", { //signin 주소에서 받을 예정
          method: "post", // method :통신방법
          headers: {      // headers: API 응답에 대한 정보를 담음
            "content-type": "application/json",
          },
          body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
          .then((res) => res.json())
          .then((json) => {
            if(json.isSuccess==="True"){
              alert('Signup Completed')
              props.setMode("LOGIN");
            }
            else{
              alert(json.isSuccess)
            }
          });
      }} /></p>
    </div>

    <p>Back to login session  <button onClick={() => {
      props.setMode("LOGIN");
    }}>Login</button></p>
  </> 
}

function App() {
  const [mode, setMode] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/authcheck")
      .then((res) => res.json())
      .then((json) => {        
        if (json.isLogin === "True") {
          setMode("WELCOME");
        }
        else {
          setMode("LOGIN");
        }
      });
  }, []); 

  let content = null;  

  if(mode==="LOGIN"){
    content = <Login setMode={setMode}></Login> 
  }
  else if (mode === 'SIGNIN') {
    content = <Signin setMode={setMode}></Signin> 
  }
  else if (mode === 'WELCOME') {
    content = <>
    <h2>Welcome to main page</h2>
    <p>Successed to log in.</p> 
    <a href="/logout">Log out</a>   
    </>
  }

  return (
    <>
      <div className="background">
        {content}
      </div>
    </>
  );
}

export default App;
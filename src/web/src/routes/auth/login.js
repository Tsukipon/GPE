import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/reducers/user.reducer";
import { register } from "../../store/reducers/user.reducer";
import { get_user_info } from "../../store/reducers/user.reducer";
import '../../components/styles/login.css'
import { useHistory } from "react-router-dom";
import { AppToaster } from "../../components/Toaster";
// window.location.reload();


const Login = props => {
  // window.location.reload(1);

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [skill, setSkill] = useState("beginner");
  const dispatch = useDispatch();

  window.addEventListener('load', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");

    });
})

///////////////////////LOGIN
  const handleSubmit = (event) => {
    dispatch(login(email, password))
    .then(request => {
      console.log(request);
      console.log(request.value.request.status);
      if (request.value.request.status === 200)
      {
        console.log("Vous êtes connecté", request);
        dispatch(get_user_info(request.value.data.token)).then(request => {
          if (request.value.request.status === 200){
            localStorage.setItem('skill', request.value.data.skill)
          }
          else {
            console.log("La récupération de l'information utilisateur a échoué")
          }
        props.handleSuccesfulAuth(request.data);
        localStorage.setItem('localToken', request.value.data.token)          
        });
      }else {
        console.log("Vous n'est pas connecté", request);
      }
    })
    .catch(error => {
      console.log("Impossible de se connecter", error);
    });
    

    event.preventDefault();
  };

  ////////////////////REGISTER
  const handleSubmitRegister = (event) => {
    dispatch(register(email, password, pseudo, visibility, description, skill))
    .then(request => {
      console.log("Ma requetes complète : ",request);
      console.log(request.value.request.status);
         if (request.value.request.status === 201)
         {
          AppToaster.show({ message: "Vous êtes bien enregistré", intent: "success" });
          //this.props.handleSuccesfulAuth(request.data);
          window.location.reload()
         }else {
          console.log("Enregistrement impossible", request);
        }
      })
    .catch(error => {
      console.log("Enregistrement impossible pas de connexion", error);
    });
    event.preventDefault();
}

  return (
        <div className="body_container_login">
          <div className="img_login"/>
          <div className="container" id="container">
            <div className="form-container sign-up-container">
              <form action="#">
                <h1>Inscription</h1>
                <div className="social-container">
                  <a href="fr-fr.facebook.com" className="social"><i className="fab fa-facebook-f"></i></a>
                  <a href="https://www.webrankinfo.com/google/plus.htm" className="social"><i className="fab fa-google-plus-g"></i></a>
                  <a href="https://fr.linkedin.com/" className="social"><i className="fab fa-linkedin-in"></i></a>
                </div>
                <span>Entrez votre e-mail pour l'inscription</span>
                <input type="text" placeholder="Pseudo " value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <div className="section_choice">
                  <label>Ton niveau</label>
                  <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <option value='beginner'> Débutant </option>
                    <option value='intermediate'> intermediate </option>
                    <option value='advanced'> Avancé </option>
                  </select>
                  <label>Type de compte</label>
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value='private'> Privé </option>
                  <option value='protected'> Proteger </option>
                  <option value='public'> Public </option>
                </select>
                </div>
                <textarea cols="30" rows="10" type="text" placeholder="Entrer une courte bio MAX 200 CHAR (optionel)" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={handleSubmitRegister}>Enregistrer</button>
              </form>
            </div>
            <div className="form-container sign-in-container">
              <form className="login_form">
                <h1>Se connecter </h1>
                <div className="social-container">
                  <a href="https://facebook.com" className="social"><i className="fab fa-facebook-f"></i></a>
                  <a href="https://www.webrankinfo.com/google/plus.htm" className="social"><i className="fab fa-google-plus-g"></i></a>
                  <a href="https://fr.linkedin.com/" className="social"><i className="fab fa-linkedin-in"></i></a>
                </div>
              <span>ou utiliser votre compte</span>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <a href="/ask_reset_password/" onClick={()=>history.push("/ask_reset_password/")}>Mot de passe oublié ?</a>
              <button onClick={handleSubmit}>Se connecter</button>
            </form>
          </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Bon retour à vous</h1>
              <p>Bienvenue !! Connectez vous ici une fois inscrit  </p>
              <button className="ghost" id="signIn">Se connecter</button>
            </div>
            <div className="overlay-panel overlay-right">
                <h1>Bonjour </h1>
                <p>Entrez vos données personnelles et commencez votre voyage avec nous</p>
                <button className="ghost" id="signUp">
                  {/* {  window.location.reload()}, */}
                  S'inscrire </button>
            </div>
         </div>
      </div>
    </div>
  </div>
  )
}
export default Login
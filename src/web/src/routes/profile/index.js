import { Button, } from "@blueprintjs/core";
import { useState } from "react";
import '../../components/styles/Profile.css'
import { useHistory } from "react-router-dom";
import { deleteUser , update_user_skill, update_user_info } from "../../store/reducers/user.reducer";
import { useDispatch } from "react-redux";
import { H3 } from "@blueprintjs/core";
import { AppToaster } from "../../components/Toaster";


// import { connect } from "react-redux";
// import { push } from "connected-react-router";

const Profile = ({ pathname, push, connected }) => {
  const history = useHistory();
  // const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [skill, setSkill] = useState("beginner");
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser()).then(request => {
      console.log(request)
      console.log(request.value.request.status);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleUpdateSkill = () => {

    dispatch(update_user_skill(skill)).then(request => {
      console.log(request)
      if(request.value.request.status === 204){
      localStorage.setItem("skill", skill);
      AppToaster.show({ message: `Vous avez maintenant un niveau ${skill}`, intent: "success" });
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const handleUpdateInfo = () => {

    dispatch(update_user_info(visibility,description)).then(request => {
      console.log(request)
      if(request.value.request.status === 204){
      AppToaster.show({ message: `Vous avez mis à jour votre profil avec succès`, intent: "success" });
      }
    }).catch(error => {
      console.log(error);
    })
  }




  return (
    <div className="body_profile">
      <div className="img_profile" />
      <div className="container_profile"  >
        <section className="showcase">
          <div className="">
            <center><h2>Configuration du profile</h2></center>
            <div className="section_profile">
              <div id="center">
                <H3>Ton niveau</H3>
                <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                  <option value='beginner'> Débutant </option>
                  <option value='intermediate'> Intermédiaire </option>
                  <option value='advanced'> Avancé </option>
                </select>
                <Button intent="primary" style={{marginTop:10}} text={"Mettre à jour"} onClick={()=> handleUpdateSkill()} />

                <H3 style={{marginTop:10}}>Type de compte</H3>
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value='private'> Privé </option>
                  <option value='protected'> Protégé </option>
                  <option value='public'> Public </option>
                </select>
              </div>
              <textarea cols="60" rows="5" type="text" placeholder="Modifier ma BIO" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div id="bottom">
                <Button className="reset_password_btn" onClick={() => history.push("/change_password/")} >Change Password</Button>

              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="box" style={{ textAlign: "" }}>
                    <Button text="<< Retour" className="back_btn" onClick={() => {history.push("/") }} />
                    <Button intent="primary" text={"Sauvegarder"} onClick={()=> handleUpdateInfo()}/>
                  </div>
                </div>
              </div>
              <div>
                <Button style={{marginTop:20}} intent="danger" text="Supprimer mon compte" type="submit" className="erase_btn" onClick={() => { handleDelete(); history.push("/"); }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile
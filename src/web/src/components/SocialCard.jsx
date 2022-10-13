import './styles/SocialCard.css'
import { PostAskSecret, PostPublicFollow } from '../store/reducers/user.reducer';
import { useDispatch } from "react-redux";
import { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Location } from './Location';
import { Status } from './Status';
import { AppToaster } from './Toaster';
import SecretModal from './SecretModal';

export const SocialCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const visibility_user = user.visibility;
  const skill_user = user.skill;

  const displayModal = () => {
    setModalVisible(!modalVisible)
  }

  const PublicFollow = (event) => {
    dispatch(PostPublicFollow(user.pseudo))
      .then(request => {
        if (request.value.request.status === 200) {
          AppToaster.show({ message: `${user.pseudo} fait maintenant partie de vos amis`, intent: "success" });
        }
      })
      .catch(error => {
        console.log("Impossible de follow", error);
        AppToaster.show({ message: `${user.pseudo} n'a pas pu être ajouté en ami, veuillez réassayer ultérieurement`, intent: "danger" });
      });
    event.preventDefault();
  };

  const AskSecret = (event) => {
    dispatch(PostAskSecret(user.pseudo))
      .then((request) => {
        if (request.value.request.status === 200) {
          AppToaster.show({ message: `Une demande d'ami a bien été envoyée à ${user.pseudo}`, intent: "success" });
        }
      }).catch(error => {
        AppToaster.show({ message: `Une demande d'ami a déjà été envoyée à ${user.pseudo}`, intent: "danger" });
        console.log("Impossible d'envoyer la demande", error);
      });
  }

  function SwitchVisibility(visibility_user) {
    switch (visibility_user) {
      case 'private':
        return <div>
          <h2>Compte : Privé</h2>
          <div>{displaySkill(skill_user)}</div>
          <h4>Cette utilisateur est en privé il n'autorise aucune demande</h4>
          <Location location={user.location}></Location>
        </div>

      case 'public':
        return <div>
          <div className='button-follow' type="submit" onClick={PublicFollow}><center>Follow</center></div>
          <h2>Compte : Public</h2>
          <div>{displaySkill(skill_user)}</div>
          <Location location={user.location}></Location>
          <Status status={user}></Status>
        </div>

      case 'protected':
        return <div>
          <div className='button-follow' type="submit" onClick={AskSecret}><center>Friend Request</center></div>
          <div className='button-follow' type="submit" onClick={displayModal}><center>Enter Secret</center></div>
          <h2>Compte : Protégé</h2>
          <div>{displaySkill(skill_user)}</div>
          <h4>Vous pouvez demander l'accès au compte</h4>
          <Location location={user.location}></Location>
        </div>
      default:
        return 'N/A'
    }
  }

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  };


  function displaySkill(skill_user) {
    switch (skill_user) {

      case 'beginner':
        return <div>
          <h4>Niveau : Utilisateur qui débute</h4>
        </div>

      case 'intermediate':
        return <div>
          <h4>Niveau : Utilisateur avec un niveau intermédiare</h4>
        </div>

      case 'advanced':
        return <div>
          <h4>Niveau : Utilisateur avec un niveau avancé</h4>
        </div>
      default:
        return "Niveau : Pas de niveau renseigné"
    }

  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div>
        {modalVisible && <SecretModal visible={modalVisible} close={displayModal} />}
        <div className="card_user">
          <div className="overlay_user_card">
            <div className='background'>
              <div className='section_topSide'>
                <div className="card_user_title"><center>{user.pseudo}</center></div>
                <div className="card_user_body">
                  <div className='fild_button_follow'>
                    <div className='button_card' onClick={handleClick}>
                      <center> BIO </center>
                    </div>
                  </div>
                  {/* <Status user={user}></Status> */}
                </div>
                <div className='section_centerSide'>
                  <div className="card_user_img">
                    {(visibility_user === "public" || visibility_user === "protected") &&
                      <div className='img_user'></div>
                    }
                    {user.visibility === "private" &&
                      <div className='img_private_user'></div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="section_bottomSide">
              <div>{SwitchVisibility(visibility_user)}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="card_user">
          <div className="card_user_title">{user.pseudo}</div>
          <div className="card_user_body">
            <div className='fild_button_follow'>
              <div className='button_card' onClick={handleClick}> <center>Retour</center> </div>
            </div>
            <div className="bio_area" type="text"><i>{user.description}</i></div>  {/*CSS à ajouter*/}
          </div>
        </div>
      </div>
    </ReactCardFlip>
  )
};
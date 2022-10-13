import { useDispatch } from 'react-redux'
import { blockRequest, ShareSecret, unblockRequest } from '../store/reducers/user.reducer';
import './styles/SocialCardFollow.css'
import { AppToaster } from './Toaster';

export const SocialCardFollow = ({ follow, friendRequest, blocked }) => {
  const dispatch = useDispatch();

  const blockUser = (event) => {
    console.log("PSEUDO:", follow.pseudo)
    dispatch(blockRequest(follow.pseudo))
      .then(request => {
        if (request.value.request.status === 200) {
          AppToaster.show({ message: `${follow.pseudo} a été bloqué`, intent: "success" });
        }
      })
      .catch(error => {
        console.log("Impossible de follow", error);
        AppToaster.show({ message: `${follow.pseudo} n'a pas été bloqué`, intent: "danger" });
      });
    event.preventDefault();
  }

  const unblockUser = (event) => {
    console.log("PSEUDO:", follow.pseudo)
    dispatch(unblockRequest(follow.pseudo))
      .then(request => {
        if (request.value.request.status === 200) {
          AppToaster.show({ message: `${follow.pseudo} a été débloqué`, intent: "success" });
        }
      })
      .catch(error => {
        console.log("Impossible de follow", error);
        AppToaster.show({ message: `${follow.pseudo} n'a pas été débloqué`, intent: "danger" });
      });
    event.preventDefault();
  }


  const acceptRequest = (event) => {
    dispatch(ShareSecret(follow.pseudo))
      .then((request) => {
        if (request.value.request.status === 200) {
          AppToaster.show({ message: `Vos informations de connexion ont bien été envoyées à ${follow.pseudo}`, intent: "success" });
        }
      }).catch(error => {
        AppToaster.show({ message: `Vos informations de connexion n'ont pas été envoyées à ${follow.pseudo}`, intent: "danger" });
        console.log("Impossible d'envoyer la demande", error);
      });
    event.preventDefault();
  }

  return (
    <div className="card_user_follower" >
      <div className='split_left'>
        <div className='img'></div>
      </div>
      <div className='split_right'>
        <div className="card_user_title_follower" > <center>{follow.pseudo}</center></div>
        <div className="card_user_body_follower" >
          <div>
            <h4>Bio : </h4><i>{follow.description}</i>
          </div>
          < div className='fild_button_follow_2'>
            {!blocked && <div className='blockBtn' onClick={blockUser}><center>Bloquer</center></div>
            }
            {blocked && <div className='unblockBtn' onClick={unblockUser}><center>Débloquer</center></div> }
            {friendRequest && <div className='addBtnFriend' onClick={acceptRequest}><center>Accepter l'invitation</center></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SocialCardFollow
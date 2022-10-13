import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from "react-redux";
import { PostProtectedFollow } from '../store/reducers/user.reducer';

import './styles/SecretModal.css'
import { AppToaster } from './Toaster';

const SecretModal = (props) => {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const handleSecretEntry = (event) => { setInput(event.target.value) }
    const ProtectedFollow = (event) => {
        dispatch(PostProtectedFollow(input))
            .then(request => {
                if (request.value.request.status === 200) {
                    AppToaster.show({ message: "Vous avez ajouté un utilisateur protégé en ami", intent: "success" });
                }
            })
            .catch(error => {
                console.log("Impossible de follow", error);
                AppToaster.show({ message: `Le secret ${input} n'est pas valide, veuillez réassayer avec un autre secret`, intent: "danger" });
            });
        event.preventDefault();
    }
    const customStyle = {
        content: {
            position: 'absolute',
            width: '30%',
            height: '30%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    return (
        <div>
            <ReactModal
                isOpen={props.visible}
                style={customStyle}
                contentLabel="Share secret modal"
            >
                <h3>Ajouter la clé secrète de l'utilisateur que vous souhaitez suivre:</h3>
                <input type="text" name="name" placeholder='Secret key' value={input} onChange={handleSecretEntry} />
                <button className='closeModalBtn' onClick={() => props.close()}>Close Modal</button>
                <button className='followModalBtn' onClick={ProtectedFollow}>Follow</button>
            </ReactModal>
        </div>
    );
}
export default SecretModal;
import { useDispatch, useSelector } from "react-redux";
import { GetFollowerRequests } from '../store/reducers/user.reducer'
import { SocialCardFollow } from "./SocialCardFollow";
import { useState } from "react";
import './styles/Community.css'


const FriendRequests = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);


    dispatch(GetFollowerRequests()).then(request => {
        if (!data) {
            setData(request)
        }
    })
    const potentialFriends = useSelector((state) => { return state.user.potentialFriends })

    return (
        <div className="row">
            {potentialFriends?.length === 0 &&
                <div className="emptyDataContainer">
                    <h2 className="emptyDataTitle">Personne ne vous a envoyé de demande d'ami</h2>
                    <img alt="Vide" className="emptyData" src={require('../data/images/wind.png').default} />
                </div>
            }
            {potentialFriends?.map((potentialFriend) => (
                <section>
                    <SocialCardFollow follow={potentialFriend} friendRequest={true} />
                </section>
            ))}
        </div>
    )
}

export default FriendRequests
import { useDispatch, useSelector } from "react-redux"
import { GetBlocked } from "../store/reducers/user.reducer";
import { useState } from "react";
import { SocialCardFollow } from "./SocialCardFollow";
import "./styles/MyCommunity.css"

const BlockedUsers = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState(null);

    dispatch(GetBlocked()).then(request => {
        if (!data) {
            setData(request)
        }
    });

    const blockedUsers = useSelector((state) => state.user.blockedUsers)

    return (
        <div className="row">
            {blockedUsers && blockedUsers.length === 0 &&
                <div className="emptyDataContainer">
                    <h2 className="emptyDataTitle">Vous n'avez bloqué aucun autre utilisateur</h2>
                    <img alt="Vide" className="emptyData" src={require('../data/images/wind.png').default} />
                </div>
            }
            {blockedUsers && blockedUsers.length > 0 && blockedUsers.map((user) => (
                <SocialCardFollow key={user.pseudo} follow={user} blocked={true} />
            ))}
        </div>
    )

}
export default BlockedUsers
import { useDispatch, useSelector } from "react-redux"
import { GetFollowed } from "../store/reducers/user.reducer";
import { useState } from "react";
import { SocialCardFollow } from "./SocialCardFollow";
import "./styles/MyCommunity.css"

const Favoris = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState(null);

    dispatch(GetFollowed()).then(request => {
        if (!data) {
            setData(request)
        }
    });

    const followed = useSelector((state) => state.user.followed)

    return (
        <div className="row">
            {followed && Object.keys(followed).length === 0 &&
                <div className="emptyDataContainer">
                    <h2 className="emptyDataTitle">Vous n'avez encore suivi personne</h2>
                    <img alt="Vide" className="emptyData" src={require('../data/images/wind.png').default} />
                </div>
            }
            {followed && followed.map((user) => (
                <SocialCardFollow key={user.pseudo} follow={user} />
            ))}
        </div>
    )

}
export default Favoris
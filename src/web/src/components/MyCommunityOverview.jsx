import { GetFollowers } from "../store/reducers/user.reducer";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SocialCardFollow } from "./SocialCardFollow";
import "./styles/MyCommunity.css"

const MyCommunityOverview = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);

    dispatch(GetFollowers()).then(request => {
        if (!data) {
            setData(request)
        }
    });

    const followers = useSelector((state) => state.user.followers);
    return (
        <div className="row">
            {followers && followers.length === 0 &&
                <div className="emptyDataContainer">
                    <h2 className="emptyDataTitle">Aucun follower ne vous suit</h2>
                    <img alt="Vide" className="emptyData" src={require('../data/images/wind.png').default} />
                </div>
            }
            {followers && followers?.map((follower) => (
                <section>
                    <SocialCardFollow key={follower.pseudo} follow={follower} />
                </section>
            ))}
        </div>
    )
}

export default MyCommunityOverview;


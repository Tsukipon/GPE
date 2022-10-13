import { GetFollowed, GetListUsers } from '../store/reducers/user.reducer'
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SocialCard } from './SocialCard';
import './styles/Community.css'

const Community = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  dispatch(GetListUsers()).then(request => {
    if (!data) {
      setData(request)
    }
  });

  dispatch(GetFollowed()).then(request => {
    if (!data) {
      setData(request)
    }
  })

  const users = useSelector((state) => state.user.users)

  console.log("USERS:",users)
  const followed = useSelector((state) => state.user.followed?.map((user) => { return user.pseudo }))
  return (
    <div className="row">
      <div className='container_communaute'>
        <h1>Retrouvez ici tous nos membres : </h1>
        <input className='search' placeholder="Entrez le nom de l'utilisateur...." onChange={event => { setSearchTerm(event.target.value) }}></input>
        <div className="container_card_user">
          {users?.filter((user) => {
            if (followed?.indexOf(user.pseudo) === -1) {
              if (searchTerm === "") {
                console.log("champ vide")
                return user;
              } else if (user.pseudo?.toLowerCase().includes(searchTerm.toLowerCase())) {
                return user;
              }
            }
          }
          ).map((user) => (
            <SocialCard key={user.pseudo} user={user}></SocialCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
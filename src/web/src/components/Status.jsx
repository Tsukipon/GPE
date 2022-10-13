import "./styles/Status.css"

export const Status = (props) => {
    
    return (
        <div className="card_inner">
            <div className="status">
                <div className="detail-box">
                    <div className="gitDetail"><span>Nombre de favoris: {props.status.number_of_followed}</span></div>
                    <div className="gitDetail"><span>Nombre d'amis: {props.status.number_of_followers}</span></div>
                    <div className="gitDetail"><span>Date d'inscription: {`${props.status.date_joined.split('.')[0].split('T')[0]} ${props.status.date_joined.split('.')[0].split('T')[1]}`}</span></div>
                </div>
            </div>
        </div>
    )
}
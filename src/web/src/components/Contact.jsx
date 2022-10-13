import './styles/Contact.css'
const Contact = props => {
    return (
        <div className="body_container_contact">
            <div className="img_contact" />
            <div className="container_contact">
                <div className="contact-in">
                    <h1>Nos Informations</h1>
                    <h2><i className="fa fa-phone" aria-hidden="true"></i> Téléphone</h2>
                    <p>+33 1 85 67 99 55</p>
                    <h2><i className="fa fa-envelope" aria-hidden="true"></i> Email</h2>
                    <p>Support@forexMetric.com</p>
                    <h2><i className="fa fa-map-marker" aria-hidden="true"></i> Addresse</h2>
                    <p>Paris, France</p>
                    <ul>
                        {/* <li><a href="https://fr-fr.facebook.com/"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                    <li><a href="https://twitter.com/"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                                    <li><a href="https://mail.google.com/"><i className="fa fa-google" aria-hidden="true"></i></a></li>
                                    <li><a href="https://www.instagram.com/"><i className="fa fa-instagram" aria-hidden="true"></i></a></li> */}
                    </ul>
                </div>
                <div className="showcase">
                    <div className="right">
                        <h2>Nous contacter</h2>
                        <input type="text" className="field" placeholder=" Votre Nom"></input>
                        <input type="text" className="field" placeholder=" Votre email"></input>
                        <textarea className="field area" placeholder=" Votre Message"></textarea>
                        <button type="submit" className="submit_btn">Envoyez</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Contact
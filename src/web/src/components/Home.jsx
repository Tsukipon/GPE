import React, { useEffect } from "react";
import './styles/Home.css'
import video2 from '../data/videos/video2.mp4';
import facebook from '../data/images/facebook.png';
import instagram from '../data/images/instagram.png';
import twitter from '../data/images/twitter.png';
import linkedin from '../data/images/linkedin.png';
import Aos from "aos";
import "aos/dist/aos.css";

const Home = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    return (
        <div className="body_home">
            <video src={video2} muted loop autoPlay id="myVideo" />
            <div className="container_home">
                <div className="overlay_home">
                    <div className="text_home">
                        <h1>Notre devise : La finance pour tous</h1>
                        <h2>Devenez rapidement un expert Forex avec notre système de formation intelligent</h2>
                        <h4>
                            Paramétrez votre propre interface, créez vos alertes, ou utilisez celle des autres !
                        </h4>
                    </div>
                    <ul className="social">
                        <li><img className="socialNetworkImg" src={facebook} alt=""></img></li>
                        <li><img className="socialNetworkImg" src={instagram} alt=""></img></li>
                        <li><img className="socialNetworkImg" src={twitter} alt=""></img></li>
                        <li><img className="socialNetworkImg" src={linkedin} alt=""></img></li>
                    </ul>
                </div>
            </div>
            <div className="section_2">
                <section>
                    {/* <div className="boxes_longue" data-aos="fade-down" data-aos-offset="300" data-aos-easing="linear" data-aos-anchor-placement="top-bottom">
                        <h1>Nous sommes préssé de vous rencontrez</h1>
                        <p>sicing elit. Laboriosam ducimus natus, voluptatibus iusto fugiat 
                            obcaecati tenetur voluptas officiis. Hic corporis qui autem pariatur enim obcaecati similique 
                            perspiciatis laborum reiciendis quasi! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam optio, veritatis, architecto eius tempore fuga totam accusamus debitis officia sapiente doloremque assumenda delectus earum consectetur 
                            illo similique? Voluptas, maiores nihil.
                        </p>
                    </div> */}
                    <div className="boxes_longue" data-aos="fade-down" data-aos-offset="300" data-aos-easing="linear">
                        <h1>Avec nous battissez votre Avenir</h1>
                        <h2>Nous mettons également à votre disposition des cours complets sur le Forex. Ces cours ont été conçus pour tout les niveaux
                            que vous soyez débutant ou expert. Qui que vous soyez, vous y trouverez votre bonheur.
                        </h2>
                    </div>
                    <div className="boxes_square_1" data-aos="zoom-in" data-aos-offset="500">
                        <div className="img_1"></div>
                        <div className="img_2"></div>
                    </div>
                    <div className="boxes_longue" data-aos="fade-down" data-aos-offset="300" data-aos-easing="linear" data-aos-anchor-placement="top-bottom">
                        <h1>Nous proposons des indicateur viables avec des graphique clair et précis</h1>
                    </div>
                </section>
            </div>

            <div className="section_3">
                <section>
                    {/* <div className="boxes_longue" data-aos="fade-down" data-aos-offset="300" data-aos-easing="linear" data-aos-anchor-placement="top-bottom">
                        <h1>Apprenez avec des quizz et selon votre niveau</h1>
                        <p>sicing elit. Laboriosam ducimus natus, voluptatibus iusto fugiat obcaecati tenetur voluptas officiis. Hic corporis qui autem pariatur enim obcaecati similique perspiciatis laborum reiciendis quasi!</p>
                    </div> */}
                    <div className="boxes_longue" data-aos="fade-down" data-aos-offset="300" data-aos-easing="linear">
                        <h1>Nous mettons l'utilisateur au centre de nos préocupation</h1>
                        <h2> Grâce à notre système de following, vous pouvez profiter du résultat de l'analyse d'autres utilisateurs en ayant l'accès à leurs alertes</h2>
                    </div>

                    <div className="home_contact" >
                        <ul>Conatct
                            <li>Qui sommes nous</li>
                            <li>Ou nous trouver</li>
                            <li>Comment nous contacter</li>
                            <li>Avez-vous essayer notre robot intelignet ?</li>
                            <li>Nos partenaire presitigieux</li>
                        </ul>
                        <ul>Produit
                            <li>Graphique</li>
                            <li>Alertes</li>
                            <li>Personnalisation</li>
                            <li>Nos indicateur</li>
                            <li>Nos Mise à jour</li>
                        </ul>
                        <ul>Société
                            <li>A propose de nous</li>
                            <li>Caractéristique</li>
                            <li>La sécurité du site</li>
                            <li>Nos métier</li>
                            <li>Les Conditions d'utilisation</li>
                            <li>Politique RGPD</li>
                            <li>Clause de non-responsabilité</li>
                            <li>Clause de non-responsabilité</li>
                            <li>Politique de confidentialité</li>
                            <li>Gestion des cookies</li>
                        </ul>
                        <ul>Communauté
                            <li>Invitez donc un amie et parrainez le</li>
                            <li>Vos retour d'expérience dans un channel dédiée</li>
                            <li>Les règles à respecté en tant que user</li>
                            <li>Retrouvez nous dans le METAVERSE</li>
                            <li>Les propos interdis</li>
                            <li>La listes de nos modérateur</li>
                            <li>Ici vous pouvez discuter d'argent et également de rien</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default Home;
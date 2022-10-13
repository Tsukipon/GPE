import '../styles/Lesson.css'
import {H1,H2,H3} from "@blueprintjs/core";
import school from '../../data/icons/school-icon-2.jpg'
import img1 from '../../data/images/lessons/lesson1/lesson1-1.png'
import img2 from '../../data/images/lessons/lesson1/img2.png'
import img3 from '../../data/images/lessons/lesson1/img3.png'
import img4 from '../../data/images/lessons/lesson1/img4.png'
import img5 from '../../data/images/lessons/lesson1/img5.png'
import img6 from '../../data/images/lessons/lesson1/img6.png'
import img7 from '../../data/images/lessons/lesson1/img7.png'
import img8 from '../../data/images/lessons/lesson1/img8.png'
import img9 from '../../data/images/lessons/lesson1/img9.png'
import img10 from '../../data/images/lessons/lesson1/img10.png'
import img11 from '../../data/images/lessons/lesson1/img11.png'
import img12 from '../../data/images/lessons/lesson1/img12.png'
import { Divider} from "@blueprintjs/core";

const Lesson1 = () =>{
    return (
        <div>
            <div className='centeredDiv'>
            
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <img alt="School" src={school}/>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
                
            </div>
            <section style={{marginLeft:'250px',marginTop:'40px'}}>
                <H1>I- Introduction au forex</H1>
                <H2>1- Qu'est-ce que le Forex ?</H2>
                <p>
                    Il s'agit tout simplement du marché financier mondial qui permet de négocier des devises.
                </p>
                <p>
                    Si vous pensez qu'une devise sera plus forte que l'autre, et que vous avez raison, 
                    vous pouvez faire des bénéfices
                </p>
                <p>
                    Il fut un temps, avant qu'une pandémie mondiale ne survienne, 
                    les gens pouvaient prendre l'avion et voyager à l'étranger.
                </p>
                <p>
                    Si vous avez déjà voyagé dans un autre pays, 
                    vous deviez généralement trouver une cabine de change à l'aéroport, 
                    puis échanger l'argent que vous aviez dans votre portefeuille dans 
                    la devise du pays que vous visitiez.
                </p>
                <img alt="Lesson1" className='image' src={img1}/>
                <p>
                    Vous vous présentez au comptoir et remarquez un écran affichant 
                    différents taux de change pour différentes devises.
                </p>
                <p>
                    Un <strong> taux de change </strong> est le prix relatif de deux monnaies de deux pays différents.
                </p>
                <p>
                    Vous trouvez du "yen japonais" et vous vous dites : 
                    "WOW ! Mon dollar vaut 100 yens ! Et j'ai 10 dollars ! 
                    Je vais être riche !!!"
                </p>
                <p>
                    Lorsque vous faites cela, vous avez essentiellement participé au marché des changes !
                </p>
                <p>
                    Vous avez échangé <strong>une monnaie contre une autre</strong>.
                </p>
                <p>
                    Ou, en termes de trading de Forex, 
                    si vous êtes un Américain en visite au Japon, vous avez vendu des dollars et acheté des yens.
                </p>
                <p>
                    Avant de prendre l'avion pour rentrer chez vous, 
                    vous vous arrêtez au stand de change pour échanger
                    les yens qu'il vous reste miraculeusement (Tokyo est chère !)
                    et vous remarquez que les taux de change ont changé.
                </p>
                <img alt="Lesson1" className='image2' src={img2}/>
                <p>
                    <strong>
                        Ce sont ces variations des taux de change qui vous 
                        permettent de gagner de l'argent sur le marché des changes.
                    </strong>
                </p>

                <H3>Et le Forex dans tout ça ?</H3>
                <p>
                    Le <strong>marché des changes</strong>, généralement appelé <strong>"forex"</strong> ou 
                    <strong>"FX"</strong>, est le plus grand marché financier du monde.
                </p>
                <p>
                    Le marché des changes est un marché mondial et décentralisé où les devises du monde entier changent de mains. 
                    Les taux de change changent à chaque seconde et le marché est donc en constante évolution.
                </p>
                <p>
                    Seul un pourcentage minuscule des transactions en devises a lieu dans l'"économie réelle", 
                    qui implique le commerce international et le tourisme, comme dans l'exemple de l'aéroport ci-dessus. 
                    Au lieu de cela, la plupart des transactions en devises qui ont lieu sur 
                    le marché mondial des changes sont achetées (et vendues) pour des raisons spéculatives.
                </p>
                <p>
                    Les traders de devises (également connus sous le nom de spéculateurs de devises) 
                    achètent des devises dans l'espoir de pouvoir les vendre à un prix plus élevé à l'avenir.
                </p>
                <p>
                    Comparé aux 200 milliards de dollars par jour du New York Stock Exchange (NYSE), 
                    le marché des changes est absolument gigantesque <br/> avec un volume d'échanges 
                    de <strong> 6,6 TRILLIONS par jour. </strong> 
                </p>
                <p>
                    Prenons un moment pour mettre cela en perspective.
                </p>
                <p>
                    Le plus grand marché boursier du monde, le New York Stock Exchange (NYSE), 
                    traite un volume d'environ 200 milliards de dollars chaque jour. 
                    Si nous utilisions un monstre pour représenter le NYSE, il ressemblerait à ceci...
                </p>
                <img alt="Lesson1" className='image' src={img3}/>
                <p>
                Vous entendez parler du NYSE tous les jours dans les journaux... à la télé... 
                "Le NYSE est en hausse aujourd'hui, bla, bla". 
                Quand les gens parlent du "marché", ils veulent généralement dire le marché boursier ( marché des actions ).
                </p>
                <p>
                    Mais si vous le comparez au marché des changes, cela ressemble à ceci...
                </p>
                <img alt="Lesson1" className='image4' src={img4}/>
                <p>
                    Le marché des changes n'est plus intimidant tout d'un coup, n'est-ce pas ?
                </p>
                <p>
                    Et le marché des crypto-monnaies est encore plus petit.
                </p>
                <p>
                    Regardez le graphique du volume quotidien moyen des transactions pour le marché des changes, 
                    la bourse de New York, la bourse de Tokyo et la bourse de Londres :
                </p>
                <img alt="Lesson1" className='image' src={img5}/>
                <p>
                    Le marché des devises est plus de 200 fois PLUS GRAND ! Il est énorme.
                </p>
                <p>
                    Mais attention, il y a un hic !
                </p>
                <p>
                    Ce chiffre énorme de 6,6 billions de dollars couvre l'ensemble du marché mondial des changes, 
                    MAIS le marché "au comptant", qui est la partie du marché des devises qui intéresse la plupart des 
                    traders, est plus petit, avec 2 billions de dollars par jour.
                </p>
                <p>
                    Et puis, si l'on se contente de comptabiliser le volume quotidien des transactions des traders particuliers 
                    (c'est-à-dire vous et moi), il est encore plus petit.
                </p>
                <p>
                    Il est très difficile de déterminer la taille exacte trading de particuliers du marché du Forex, 
                    mais on estime qu'il représente environ 3 à 5 % du volume global des opérations de change quotidiennes, 
                    soit environ 200 à 300 milliards de dollars (probablement moins).
                </p>
                <p>
                    Vous voyez donc que le marché du forex est certainement énorme, 
                    mais pas autant que les autres voudraient vous le faire croire.
                </p>
                <img alt="Lesson1" className='image4' src={img6}/>

                <p>
                    Outre sa taille, le marché est rarement fermé ! Il est ouvert pratiquement 24 heures sur 24.
                </p>
                <p>
                    Le marché des changes est ouvert <strong>24 heures sur 24 et 5 jours sur 7</strong>, et ne ferme que le week-end. 
                    (Quelle bande de fainéants !)
                </p>
                <p>
                Ainsi, contrairement aux marchés boursiers ou obligataires, 
                le marché des changes ne ferme PAS à la fin de chaque jour ouvrable.
                </p>
                <p>
                    Au lieu de cela, les transactions se déplacent simplement vers différents 
                    centres financiers dans le monde.
                </p>
                <img alt="Lesson1" className='image4' src={img7}/>
                <p>
                    La journée commence lorsque les traders se réveillent à Auckland/Wellington, 
                    puis se déplace à Sydney, Singapour, Hong Kong, Tokyo, Francfort, Londres, et enfin, 
                    New York, avant que le trading ne recommence en Nouvelle-Zélande !
                </p>

                <H2>2- Qu'est ce qui est échangé dans le Forex ?</H2>
                <p>
                     La réponse simple est ARGENT. Plus précisément, les devises.
                </p>
                <p>
                    Parce que vous n'achetez rien de physique, le trading forex peut être déroutant,
                    nous allons donc utiliser une analogie simple (mais imparfaite) pour vous aider à expliquer.
                </p>
                <p>
                    Considérez l'achat d'une devise comme l'achat d'une action dans un pays particulier, 
                    un peu comme l'achat d'actions dans une entreprise.
                </p>
                <p>
                    Le prix de la devise est généralement le reflet direct de l'opinion du marché sur la santé actuelle 
                    et future de son économie respective.
                </p>
                <p>
                    Dans le trading forex, lorsque vous achetez, disons, du yen japonais, 
                    vous achetez essentiellement une "part" de l'économie japonaise.
                </p>
                <img alt="Lesson1" className='image5' src={img8}/>
                <p>
                    Vous faites le pari que l'économie japonaise se porte bien, et s'améliorera même avec le temps.
                </p>
                <p>
                    Une fois que vous aurez revendu ces « actions » sur le marché, nous espérons que vous réaliserez un profit.
                </p>
                <p>
                    <strong> En général, le taux de change d'une devise par rapport à d'autres devises 
                    reflète l'état de l'économie de ce pays, par rapport à d'autres économies.</strong> 
                </p>

                    <H3>Principales devises</H3>

                <p>
                    Bien qu'il existe potentiellement de nombreuses devises que vous pouvez échanger, 
                    en tant que nouveau cambiste, vous commencerez probablement à négocier avec les "<strong>principales devises</strong>".
                </p>
                <img alt="Lesson1" className='image6' src={img9}/>
                <p>
                    On les appelle les «<strong>monnaies majeures</strong>» parce qu'elles sont les devises 
                    les plus échangées et représentent certaines des plus grandes économies du monde.
                </p>
                <p>
                    Les cambistes diffèrent sur ce qu'ils considèrent comme les « principales devises ».
                </p>
                <p>
                    Les plus tendus qui ont probablement obtenu des A et ont suivi toutes les règles alors que les enfants 
                    ne considèrent que l'USD, l'EUR, le JPY, le GBP et le CHF comme des devises principales.
                </p>
                <p>
                    Ensuite, ils qualifient l'AUD, le NZD et le CAD de "<strong>devises de matières premières</strong>".
                </p>
                <p>
                    Pour nous les rebelles, et pour simplifier les choses, 
                    nous considérons simplement les huit devises comme les « majeures ».
                </p>
                <p>
                    Ci-dessous, nous les listons par leur symbole, le pays où ils sont utilisés,
                    le nom de la devise et les surnoms sympas.
                </p>
                <p>
                    <img alt="Lesson1" className='image7' src={img10}/>
                </p>
                

                <img alt="Lesson1" className='image8' src={img11}/>

                <p>
                    Les symboles monétaires ont toujours <strong>trois lettres</strong> , où les deux premières lettres identifient le nom du pays 
                    et la troisième lettre identifie le nom de la devise de ce pays, généralement la première lettre du nom de la devise.
                </p>
                <p>
                    Ces trois lettres sont connues sous le nom de <strong>codes de devise ISO 4217</strong>.
                </p>
                <p>
                    En 1973, l'<strong>Organisation internationale de normalisation</strong> (ISO) 
                    a établi les codes à trois lettres pour les devises que nous utilisons aujourd'hui.
                </p>

                <img alt="Lesson1" className='image9' src={img12}/>

                <p>
                    Prenez le <strong>NZD</strong> par exemple…
                </p>
                <p>
                    <strong>NZ</strong> signifie Nouvelle-Zélande, tandis que <strong>D</strong> signifie dollar.
                </p>
                <p>
                    Assez facile, non ?
                </p>
                <p>
                    Les devises incluses dans le tableau ci-dessus sont appelées les « majeures» 
                    car ce sont les plus échangées.
                </p>

            </section>
            
        </div>
        
    )
}
export default Lesson1
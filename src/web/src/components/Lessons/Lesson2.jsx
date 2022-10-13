import '../styles/Lesson.css'
import {H1,H2,H3} from "@blueprintjs/core";
import school from '../../data/icons/school-icon-2.jpg'
import img2 from '../../data/images/lessons/lesson2/img2.png'
import img3 from '../../data/images/lessons/lesson2/img3.png'
import img4 from '../../data/images/lessons/lesson2/img4.png'
import img5 from '../../data/images/lessons/lesson2/img5.png'
import img6 from '../../data/images/lessons/lesson2/img6.png'
import img7 from '../../data/images/lessons/lesson2/img7.png'
import img8 from '../../data/images/lessons/lesson2/img8.png'
import img9 from '../../data/images/lessons/lesson2/img9.png'
import img10 from '../../data/images/lessons/lesson2/img10.png'
import { Divider } from "@blueprintjs/core";

const Lesson2 = () =>{
    return (
        <div>
            <div className='centeredDiv'>
            
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <img alt="Lesson2" src={school}/>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
                
            </div>
            <section style={{marginLeft:'250px',marginTop:'40px'}}>
                <H1>II- Introduction au trading forex</H1>
                <H2>1- Acheter et vendre une paire de devise</H2>
                <p>
                    Qu'est-ce que le trading forex ?
                </p>
                <p>
                    Le trading Forex est l'achat simultané d'une devise et la vente d'une autre.
                </p>
                <p>
                    Les devises sont négociées par l'intermédiaire d'un "courtier forex" 
                    ou d'un "fournisseur de CFD" et sont <strong>négociées par paires</strong>. 
                    Les devises sont cotées par rapport à une autre devise.
                </p>
                <p>
                    Par exemple, l'euro et le dollar américain <strong>(EUR/USD)</strong> ou 
                    la livre sterling et le yen japonais <strong>(GBP/JPY)</strong>.
                </p>
                <p>
                    <strong>Lorsque vous négociez sur le marché des changes, 
                    vous achetez ou vendez des paires de devises.</strong>
                </p>
                <img alt="Lesson2" className='image1' src={img2}/>

                <p>
                    Imaginez chaque paire de devises constamment dans un « bras de fer » 
                    avec chaque devise de son propre côté de la corde.
                </p>
                <p>
                    Un taux de change est le prix relatif de deux devises de deux pays différents.
                </p>
                <p>
                    Les taux de change fluctuent en fonction de la devise la plus forte en ce moment.
                </p>
                <p>
                    Il existe trois catégories de paires de devises :
                </p>
                <ol>
                    <li>Les "<strong>majeures</strong>".</li>
                    <li>Les "<strong>croix</strong>".</li>
                    <li>Les "<strong>exotiques</strong>".</li>
                </ol>
                <p>
                    Les principales paires de devises incluent toujours le dollar américain.
                </p>
                <p>
                Les paires de devises croisées n'incluent PAS le dollar américain. 
                Les cross qui impliquent l'une des principales devises sont également appelés "mineurs".
                </p>
                <p>
                    Les paires de devises exotiques se composent d'une devise principale et d'une devise d'un marché émergent (EM).
                </p>
                    <H3>Principales paires de devises</H3>

                <img alt="Lesson2" className='image2' src={img3}/>

                <p>Les paires de devises répertoriées ci-dessous 
                sont considérées comme les « <strong>majeures</strong> ».</p>

                <p>
                    Ces paires contiennent toutes le dollar américain (<strong>USD</strong>) 
                    d'un côté et sont les plus fréquemment échangées.
                </p>
                <p>
                    Bien qu'il existe HUIT devises principales, 
                    il n'y a que SEPT paires de devises principales.
                </p>
                <p>
                    Comparé aux cross et aux exotiques, 
                    le prix évolue plus fréquemment avec les majors, ce qui offre plus d'opportunités de trading.
                </p>
                <p>
                    <img alt="Lesson2" className='image3' src={img4}/>
                </p>

                <p>
                    Les paires les plus populaires sont les plus <strong>liquide</strong>  dans le monde.
                </p>
                <p>
                    La liquidité est utilisée pour décrire le niveau d'activité sur le marché financier.
                </p>

                <p>
                    Sur le forex, il est basé sur le nombre de traders actifs achetant 
                    et vendant une paire de devises spécifique et sur le volume échangé.
                </p>
                <p>
                     Plus quelque chose est fréquemment échangé, plus sa liquidité est élevée.
                </p>
                <p>
                    Par exemple, plus de personnes négocient la paire de devises EUR/USD 
                    et à des volumes plus élevés que la paire de devises AUD/USD.
                </p>
                <p>
                    Cela signifie que l'EUR/USD est plus liquide que l'AUD/USD.
                </p>

                <H2>2- La taille du marché du Forex et la liquidité</H2>
                <p>
                    L'essentiel du trading forex a lieu sur ce qu'on appelle le "<strong>marché interbancaire</strong>"
                </p>
                <p>
                    Contrairement à d'autres marchés financiers comme la Bourse de New York (NYSE) ou la Bourse de Londres (LSE),
                    <strong>le marché des changes n'a ni emplacement physique ni bourse centrale</strong>.
                </p>
                <p>
                    Le marché des changes est considéré comme un marché de gré à gré (OTC) en 
                    raison du fait que l'ensemble du marché est géré électroniquement, 
                    au sein d'un réseau de banques, en continu sur une période de 24 heures.
                </p>
                <p>
                    Cela signifie que le marché des changes est réparti 
                    dans le monde entier sans emplacement central.
                </p>
                <p>
                    Les échanges peuvent avoir lieu n'importe où tant que vous 
                    disposez d'une connexion Internet !
                </p>

                <img alt="Lesson2" className='image4' src={img5}/>

                <p>
                    Le marché forex OTC est de loin le marché financier 
                    le plus grand et le plus populaire au monde.
                </p>
                <p>
                    Et il est commercialisé à l'échelle mondiale par un grand nombre d'individus et d'organisations.
                </p>
                <p>
                    Dans un marché OTC, les participants peuvent être pointilleux et déterminer avec 
                    qui ils veulent négocier en fonction des conditions de négociation, de l'attractivité des prix et de la réputation de
                    la contrepartie commerciale (l'autre partie qui prend le côté opposé de votre transaction).
                </p>
                <p>
                    Le graphique ci-dessous montre les sept devises <strong>les plus activement négociées</strong>.
                </p>
                
                <img alt="Lesson2" className='image5' src={img6}/>
                
                <p>
                Le <strong>dollar américain</strong> est la devise la plus échangée, 
                représentant <strong>84,9 %</strong> de toutes les transactions !
                </p>
                <p>
                La part de <strong>l'euro </strong>est deuxième à 39,1 %, tandis que celle du <strong>yen</strong> est troisième à 19,0 %.
                </p>
                <p>
                Comme vous pouvez le constater, la plupart des principales devises 
                occupent les premières places de cette liste!
                </p>

                <H3>Le dollar est roi sur le marché Forex</H3>
                <img alt="Lesson2" className='image6' src={img7}/>
                 
                <p>
                Vous avez probablement remarqué à quelle fréquence nous mentionnons le <strong>dollar américain (USD)</strong>.
                </p>
                <p>
                Si l'USD représente la moitié de chaque paire de devises majeures et que
                les majeures représentent <strong>75% de toutes les transactions</strong>, 
                il est indispensable de prêter attention au dollar américain. L'USD est roi!
                </p>
                <img alt="Lesson2" className='image7' src={img8}/>
                
                <p>
                En fait, selon le Fonds monétaire international (FMI), 
                le dollar américain représente environ <strong>62 % des réserves de change officielles mondiales !</strong>
                </p>
                <p>
                Les réserves de change sont des actifs détenus en réserve par une banque centrale en devises étrangères.
                </p>

                <p>
                Parce que presque tous les investisseurs, 
                entreprises et banques centrales en sont propriétaires, ils prêtent attention au dollar américain.
                </p>
                <img alt="Lesson2" className='image8' src={img9}/>

                <p>
                Il existe également d'autres raisons importantes 
                pour lesquelles le dollar américain joue un <strong>rôle central</strong> sur le marché des changes:
                </p>

                <ul>
                    <li>
                    - L'économie des États-Unis est la <strong>PLUS GRANDE économie</strong> du monde.
                    </li>
                    <li>
                    - Le dollar américain est la monnaie de <strong>réserve du monde</strong>.
                    </li>
                    <li>
                    - Les États-Unis ont les <strong>marchés financiers les plus vastes et les plus liquides</strong> du monde.
                    </li>
                    <li>
                    - Les États-Unis ont un <strong>système politique stable</strong>.
                    </li>
                    <li>
                    - Les États-Unis sont la seule <strong>superpuissance militaire</strong> au monde.
                    </li>
                    <li>
                    - Le dollar américain représente environ la moitié des <strong>prêts et obligations internationaux</strong>.
                     De nombreux pays et entreprises étrangères empruntent en USD.
                    </li>
                    <li>
                    -  Le dollar américain est le moyen d'échange pour de nombreuses <strong>transactions transfrontalières</strong>. 
                     Par exemple, le prix du pétrole est en dollars américains. Aussi appelés « pétrodollars ».
                     Donc, si le Japon veut acheter du pétrole à l'Arabie saoudite, 
                     il ne peut l'acheter qu'avec le dollar américain. Si le Japon n'a pas de dollars, 
                     il doit d'abord vendre son yen et acheter des dollars américains.
                    </li>
                </ul>
                <img alt="Lesson2" className='image9' src={img10}/>
                <p>
                Fondamentalement, 
                le monde dépend fortement de l'approvisionnement continu en USD pour faciliter les échanges, 
                les paiements et les prêts.
                </p>

                <H3>Spéculation sur le marché Forex</H3>
                <p>
                Une chose importante à noter à propos du marché des changes est que si les transactions 
                commerciales et financières font partie du volume des transactions, 
                la plupart des échanges de devises sont basés sur la <strong>spéculation</strong>.
                </p>
                <p>
                En d'autres termes, la majeure partie du volume des transactions provient de commerçants qui achètent et 
                vendent en fonction des mouvements de prix à court terme des paires de devises.
                </p>
                <p>
                Le volume d'échanges apporté par les spéculateurs est estimé à plus de 90% !
                </p>
                <p>
                L'ampleur du marché des changes signifie que 
                la liquidité - <strong>le volume d'achat et de vente qui se produit à un moment donné</strong> - est extrêmement élevée.
                </p>
                <p>
                Cela rend très facile pour quiconque d'acheter et de vendre des devises.
                </p>
                <p>
                Du point de vue d'un trader, la liquidité est très importante car elle détermine 
                la facilité avec laquelle un prix peut changer sur une période donnée.
                </p>
                <p>
                Un environnement de marché liquide comme le forex permet d'énormes 
                volumes de transactions avec très peu d'effet sur le prix ou l'action des prix.
                </p>
                <p>
                Bien que le marché des changes soit relativement très liquide, 
                la profondeur du marché peut varier en fonction de la paire de devises et de l'heure de la journée.
                </p>
                <p>
                Dans nos sessions de trading forex de l'école, 
                nous expliquerons comment le moment de vos transactions peut affecter la paire que vous négociez.
                </p>
            </section>
            
        </div>
        
    )
}
export default Lesson2
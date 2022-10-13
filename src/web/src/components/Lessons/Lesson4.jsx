import '../styles/Lesson.css'
import {H1,H2,H3,H4} from "@blueprintjs/core";
import school from '../../data/icons/school-icon-2.jpg'
import img2 from '../../data/images/lessons/lesson4/img2.png'
import img3 from '../../data/images/lessons/lesson4/img3.png'
import img4 from '../../data/images/lessons/lesson4/img4.png'
import img5 from '../../data/images/lessons/lesson4/img5.png'
import img6 from '../../data/images/lessons/lesson4/img6.png'
import img7 from '../../data/images/lessons/lesson4/img7.png'
import { Divider } from "@blueprintjs/core";

const Lesson4 = () =>{
    return (
        <div>
            <div className='centeredDiv'>
            
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <img  alt="Lesson4" src={school}/>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
                
            </div>
            <section style={{marginLeft:'250px',marginTop:'40px'}}>
                <H1>IV- Le trading et le forex</H1>
                <H2>1- Comment gagner de l'argent avec le Forex</H2>
                <p>
                Qu'est-ce que le trading forex ?
                </p>
                <p>
                Le marché du forex (également appelé FX ou change) fait référence au marché mondial 
                où les banques, les institutions et les particuliers spéculent sur le taux de change 
                entre les monnaies fiduciaires.
                </p>
                <p>
                Le marché des changes est le plus grand marché financier au monde.
                </p>
                
                <H3>Comment fonctionne le trading forex ?</H3>
                <p>
                En tant que cambiste, vous spéculez sur la hausse ou la baisse du prix d'une 
                devise par rapport à une autre devise.
                </p>
                <p>
                Ainsi, le « trading forex » peut être défini comme le processus de <strong>spéculation 
                sur les prix des devises pour essayer de réaliser un profit</strong>.
                </p>
                <p>
                La valeur d'une monnaie est influencée par les événements économiques,
                 politiques, géopolitiques et les flux commerciaux et financiers.
                </p>
                <p>
                Placer une transaction sur le marché des changes est simple.
                </p>
                <p>
                Les mécanismes d'une transaction sont très similaires à ceux que l'on trouve 
                sur d'autres marchés financiers (comme la bourse), donc si vous avez de l'expérience dans 
                le trading, vous devriez pouvoir l'acquérir assez rapidement.
                </p>
                <p>
                Et si vous ne le faites pas, vous pourrez toujours le récupérer… tant que vous aurez terminé 
                School of Pipsology, notre cours de trading forex !
                </p>
                <p>
                L'objectif du trading forex est d'échanger une devise contre une autre
                dans l'espoir que le prix changera.
                </p>
                <p>
                Plus précisément, la devise que vous avez achetée prendra de la valeur 
                par rapport à celle que vous avez vendue .
                </p>
                <p>
                Voici un exemple :
                </p>
                <p>
                <img alt="Lesson4" className='image2' src={img2}/>
                </p>
                <p>
                    <strong>Un taux de change est simplement le rapport entre une devise et une autre devise.</strong>
                </p>
                <p>
                Par exemple, le taux de change USD/CHF indique combien de dollars américains peuvent 
                acheter un franc suisse, ou combien de francs suisses vous avez besoin pour acheter un dollar américain.
                </p>
                <H3>Comment lire une cotation Forex</H3>
                <p>
                Les devises sont toujours cotées par paires, comme GBP/USD ou USD/JPY.
                </p>
                <p>
                La raison pour laquelle ils sont cotés par paires est que,
                dans chaque opération de change, <strong>vous achetez simultanément une devise et en vendez une autre</strong>.
                </p>
                <p>
                Comment savoir quelle devise vous achetez et laquelle vous vendez ?
                </p>
                <p>
                Excellente question ! C'est là qu'interviennent les concepts de devises de base et de cotation…
                </p>

                <H3>Devise de base et de cotation</H3>

                <p>
                Chaque fois que vous avez une position ouverte dans le trading forex, 
                vous <strong>échangez une devise contre une autre</strong>. 
                </p>
                <p>
                Les devises sont cotées par rapport aux autres devises.
                </p>
                <p>
                Voici un exemple de taux de change pour la livre sterling par rapport au dollar américain :
                </p>

                <img alt="Lesson4" className='image3' src={img3}/>

                <p>
                La première devise répertoriée à gauche de la barre oblique ("/") est connue comme la devise 
                de base (dans cet exemple, la livre sterling).
                </p>
                <p>
                La devise de base est l' élément de référence pour le taux de change de la paire de devises. 
                Il a toujours la valeur un.
                </p>
                <p>
                La deuxième devise répertoriée à droite est appelée la devise de compteur ou
                 de cotation (dans cet exemple, le dollar américain).
                </p>
                <p>
                Lors de l'achat, le taux de change vous indique combien vous devez 
                payer en unités de la devise de cotation pour acheter UNE unité de la devise de base .
                </p>
                <p>
                Dans l'exemple ci-dessus, vous devez payer 1,21228 dollars américains pour acheter 1 livre sterling .
                </p>
                <p>
                Lors de la vente, le taux de change vous indique le nombre d'unités de la devise de cotation 
                que vous obtenez pour la vente d' <strong>UNE unité de la devise de base</strong>.
                </p>
                <p>
                Dans l'exemple ci-dessus, vous recevrez 1,21228 dollars américains lorsque 
                vous vendez 1 livre sterling .
                </p>
                <p>
                La devise de base représente la quantité de devise de cotation 
                nécessaire pour que vous obteniez une unité de la devise de base
                </p>
                <p>
                Si vous achetez de l' EUR/USD , cela signifie simplement que 
                vous achetez la devise de base et que vous vendez simultanément la devise de cotation.
                </p>
                <p>
                Dans le discours de l'homme des cavernes, "achetez de l'EUR, vendez de l'USD".
                </p>
                <ul>
                    <il>- Vous achèteriez la paire si vous pensez que la devise 
                    de base va s'apprécier (prendre de la valeur) par rapport à la devise de cotation.</il>
                    <il>- Vous vendriez la paire si vous pensez que la devise de base va se déprécier 
                    (perdre de la valeur) par rapport à la devise de cotation.</il>
                </ul>
                <p>
                Avec autant de paires de devises à négocier, comment les courtiers forex
                 savent-ils quelle devise répertorier comme devise de base et devise de cotation ?
                </p>
                <p>
                Heureusement, la manière dont les paires de devises sont cotées sur le marché des changes est 
                standardisée.
                </p>
                <p>
                Vous avez peut-être remarqué que les devises cotées en tant 
                que paire de devises sont généralement séparées par une barre oblique ("/").
                </p>
                <p>
                Sachez simplement que c'est une question de préférence et que la barre 
                oblique peut être omise ou remplacée par un point, un tiret ou rien du tout.
                </p>
                <p>
                Par exemple, certains commerçants peuvent taper « EUR/USD » comme 
                « EUR-USD » ou simplement « EURUSD ». Ils signifient tous la même chose.
                </p>

                <H3>"Long et court"</H3>

                <p>
                Tout d'abord, vous devez déterminer si vous souhaitez <strong>acheter</strong> ou <strong>vendre</strong>.
                </p>
                <p>
                Si vous voulez acheter (ce qui signifie en fait acheter la devise de base et
                 vendre la devise de cotation), vous voulez que la valeur de la devise de base augmente, 
                 puis vous la revendez à un prix plus élevé.
                </p>
                <p>
                Dans le langage des commerçants, cela s'appelle "être long" ou prendre une "position longue".
                 N'oubliez pas : <strong>long = acheter</strong>.
                </p>
                <p>
                Si vous voulez vendre (ce qui signifie en fait vendre la devise de base et acheter la devise de cotation), 
                vous voulez que la valeur de la devise de base baisse, puis vous la rachèterez à un prix inférieur.
                </p>
                <p>
                C'est ce qu'on appelle « prendre une position courte » ou prendre une « position courte ».
                </p>
                <p>N'oubliez pas : <sytong>short = vendre</sytong>.</p>
                <img alt="Lesson4" className='image4' src={img4}/>

                <H3>Plat ou carré</H3>

                <p>
                Si vous n'avez pas de <strong>position ouverte</strong> , alors on dit que vous êtes « <strong>plat</strong> » ou « <strong>carré</strong> » .
                </p>
                <p>
                <strong>Clôturer une position</strong>  est aussi appelé « <strong>squaring up</strong> ».
                </p>

                <img alt="Lesson4" className='image5' src={img5}/>

                <H3>L'enchère, la demande et le spread</H3>

                <p>
                Toutes les cotations forex sont cotées avec deux prix : le <strong>bid</strong> et le <strong>ask</strong>  .
                </p>
                <p>
                En général, l' <strong>offre</strong> est inférieure au prix <strong>demandé</strong> .
                </p>

                <img alt="Lesson4" className='image6' src={img6}/>

                <H4>Qu'est-ce qu'une "enchère" ?</H4>

                <p>
                L' <strong>offre</strong> est le prix auquel votre courtier est prêt à acheter la devise de base en échange 
                de la devise de cotation.
                </p>
                <p>
                Cela signifie que l'offre est le meilleur prix disponible auquel vous (le commerçant)
                 pouvez vendre sur le marché.
                </p>
                <p>
                Si vous souhaitez vendre quelque chose, le courtier vous l'achètera au prix de l' <strong>offre</strong> .
                </p>

                <H4>Qu'est-ce que "Demander" ?</H4>
                
                <p>
                La <strong>demande</strong> est le prix auquel votre courtier vendra la devise 
                de base en échange de la devise de cotation.
                </p>
                <p>
                Cela signifie que le prix demandé est le meilleur prix disponible auquel vous pouvez acheter sur le marché.
                </p>
                <p>
                Un autre mot pour demander est le <strong>prix de l'offre</strong>.
                </p>
                <p>
                Si vous voulez acheter quelque chose, le courtier vous le vendra (ou vous l'offrira) 
                au prix <strong>demandé</strong> .
                </p>

                <H4>Qu'est-ce que la « diffusion » ?</H4>
                
                <p>
                La différence entre le cours acheteur et le cours vendeur est connue sous le nom de <strong>SPREAD</strong> .
                </p>
                <p>
                Sur la cotation EUR/USD ci-dessus, le cours acheteur est de 1,34568 et le cours vendeur est de 1,34588.
                Regardez comment ce courtier vous permet d'échanger votre argent si facilement.
                </p>
                <ul>
                    <il>- Si vous souhaitez vendre des euros, vous cliquez sur « Vendre » 
                    et vous vendrez des euros à 1,34568.</il>
                    <il>- Si vous voulez acheter de l'EUR, vous cliquez sur "Acheter" 
                    et vous achèterez des euros à 1,34588.</il>
                </ul>
                <p>
                Voici une illustration qui rassemble tout ce que nous avons couvert dans cette leçon :
                </p>

                <img alt="Lesson4" className='image7' src={img7}/>


            </section>
            
        </div>
        
    )
}
export default Lesson4
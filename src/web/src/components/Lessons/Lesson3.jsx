import '../styles/Lesson.css'
import {H1,H2,H3} from "@blueprintjs/core";
import school from '../../data/icons/school-icon-2.jpg'
import img2 from '../../data/images/lessons/lesson3/img2.png'
import { Divider } from "@blueprintjs/core";

const Lesson3 = () =>{
    return (
        <div>
            <div className='centeredDiv'>
            
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <img  alt="Lesson3" src={school}/>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
                
            </div>
            <section style={{marginLeft:'250px',marginTop:'40px'}}>
                <H1>III- Comment tradez-vous le Forex ?</H1>
                <H2>1- Comment trader le Forex</H2>

                <p>
                Comment les gens participent-ils au marché des changes ?
                </p>
                <p>
                Jusqu'à présent, vous avez appris ce qu'est le marché des changes, sa taille, 
                les différents types de devises et comment elles sont vendues par paires.
                </p>
                <p>
                Mais comment tradez-vous le forex ?
                </p>
                <p>
                Voyons maintenant comment participer en tant que commerçant.
                </p>

                <H3>Comment trader le Forex</H3>
                <p>
                Parce que le forex est si génial, 
                les traders ont proposé un certain nombre de façons différentes d'investir ou de spéculer sur les devises.
                </p>
                <p>
                Parmi les instruments financiers, les plus populaires sont le forex de détail ,  le change au comptant , 
                 les contrats à terme sur devises,  les options sur devises, les fonds négociés en bourse (ou ETF), 
                 les CFD sur le forex et les paris sur les écarts de change.
                </p>
                <p>
                <img alt="Lesson3" className='image2' src={img2}/>
                </p>
                <p>
                 Il est important de souligner que nous couvrons les différentes manières
                 dont les traders individuels ("de détail") peuvent négocier des devises.
                </p>
                <p>
                D'autres instruments financiers tels que les swaps de change et les contrats à 
                terme  ne sont pas couverts car ils s'adressent aux commerçants institutionnels.
                </p>
                <p>
                Avec cela à l'écart, discutons maintenant de la façon dont
                 vous pouvez participer au monde du forex.
                </p>
                
                <H3>Contrats à terme sur devises</H3>
                <p>
                Les contrats à terme sont des contrats d'achat ou de vente d'un certain 
                actif à un prix spécifié à une date future (c'est pourquoi on les appelle des contrats à terme !).
                </p>
                <p>
                Un contrat à terme sur devises est un contrat qui détaille 
                le prix auquel une devise pourrait être achetée ou vendue et fixe une date précise pour l'échange.
                </p>
                <p>
                Les contrats à terme sur devises ont été créés par le Chicago Mercantile Exchange (CME) en 1972, 
                lorsque les cloches et les bottes à plateforme étaient encore à la mode.
                </p>
                <p>
                Étant donné que les contrats à terme sont standardisés et
                 négociés sur une bourse centralisée, le marché est très transparent et bien réglementé.
                </p>
                <p>
                Cela signifie que les informations sur les prix et les transactions sont facilement disponibles.
                </p>
                <p>
                Vous pouvez en savoir plus sur les contrats à terme FX de CME ici .
                </p>

                <H3>Options de devise</H3>

                <p>
                Une « option » est un instrument financier qui donne à l'acheteur le droit ou l'option,
                 mais non l'obligation, d'acheter ou de vendre un actif à un prix spécifié à la date d'expiration de l'option.
                </p>
                <p>
                Si un trader "vendait" une option, il serait alors obligé 
                d'acheter ou de vendre un actif à un prix spécifique à la date d'expiration.
                </p>
                <p>
                Tout comme les contrats à terme, les options sont également négociées sur une bourse, 
                comme le Chicago Mercantile Exchange  (CME),l' International Securities Exchange  
                (ISE) ou le Philadelphia Stock Exchange  (PHLX).
                </p>
                <p>
                Cependant, l'inconvénient du trading d'options FX est que les heures de marché 
                sont limitées pour certaines options et la liquidité n'est pas aussi grande 
                que le marché à terme ou au comptant.
                </p>
                <H3>ETF sur devises</H3>
                <p>
                Un ETF sur devises offre une exposition à une seule devise ou à un panier de devises.
                </p>
                <p>
                Les ETF sur devises permettent aux particuliers ordinaires de s'exposer au marché 
                des changes par le biais d'un fonds géré sans le fardeau de placer des transactions individuelles.
                </p>
                <p>
                Les ETF sur devises peuvent être utilisés pour spéculer sur le forex, 
                diversifier un portefeuille ou se couvrir contre les risques de change.
                </p>
                <p>
                Voici une liste des ETF sur devises les plus négociés .
                </p>
                <p>
                Les ETF sont créés et gérés par des institutions financières qui achètent et détiennent des devises dans un fonds. 
                Ils offrent ensuite des actions du fonds au public sur une bourse vous permettant d'acheter et 
                de négocier ces actions tout comme des actions.
                </p>
                <p>
                Comme les options sur devises, la limitation du trading des ETF sur devises est que le marché
                n'est pas ouvert 24 heures sur 24. 
                De plus les FNB sont assujettis à des commissions de négociation et à d'autres frais de transaction.
                </p>

                <H3>Effets ponctuels</H3>

                <p>
                Le marché des changes au comptant est un marché « hors bourse », 
                également appelé marché de gré à gré («OTC»).
                </p>
                <p>
                Le marché des changes hors bourse est un grand marché financier 
                en croissance et liquide qui fonctionne 24 heures sur 24.
                </p>
                <p>
                Il ne s'agit pas d'un marché au sens traditionnel du terme, 
                car il n'y a pas d'emplacement commercial central ou « d'échange ».
                </p>
                <p>
                Sur un marché OTC, un client négocie directement avec une contrepartie.
                </p>
                <p>
                Contrairement aux contrats à terme sur devises, aux ETF et (à la plupart) des options sur devises, 
                qui sont négociés sur des marchés centralisés , 
                les devises au comptant sont des contrats de gré à gré (accords privés entre deux parties).
                </p>
                <p>
                La plupart des échanges sont effectués via des réseaux de négociation électroniques (ou par téléphone).
                </p>
                <p>
                Le marché primaire pour FX est le marché « interdealer » où les courtiers FX négocient entre eux.
                 Un dealer est un intermédiaire financier qui se tient prêt à acheter ou à vendre des devises 
                 à tout moment avec ses clients.
                </p>
                <p>
                Le marché interconcessionnaire est également connu sous le nom de marché « interbancaire »
                 en raison de la prédominance des banques en tant que courtiers en devises.
                </p>
                <p>
                Le marché des intermédiaires n'est accessible qu'aux institutions qui 
                négocient de grandes quantités et ont une valeur nette très élevée.
                </p>
                <p>
                Cela comprend les banques, les compagnies d'assurance, les fonds de pension, les grandes entreprises et 
                d'autres grandes institutions financières qui gèrent les risques associés aux fluctuations des taux de change.
                </p>
                <p>
                Sur le marché des changes au comptant, un trader institutionnel achète et vend 
                un accord ou un contrat pour effectuer ou prendre livraison d'une devise .
                </p>
                <p>
                Une transaction de change au comptant est un accord bilatéral ("entre deux parties") 
                pour échanger physiquement une devise contre une autre devise.
                </p>
                <p>
                Cet accord est un contrat . Cela signifie que ce contrat au comptant est une obligation 
                contraignante d'acheter ou de vendre une certaine quantité de devises étrangères à un 
                prix qui est le « taux de change au comptant » ou le taux de change actuel.
                </p>
                <p>
                Ainsi, si vous achetez de l'EUR/USD sur le marché au comptant, vous négociez un contrat 
                qui spécifie que vous recevrez un montant spécifique d'euros en échange de dollars américains
                à un prix (ou taux de change) convenu.
                </p>
                <p>
                Il est important de souligner que vous n'échangez PAS les devises sous-jacentes elles-mêmes,
                 mais un contrat impliquant les devises sous-jacentes.
                </p>
                <p>
                Même si cela s'appelle « au comptant », les transactions ne sont pas exactement réglées « sur place ».
                </p>
                <p>
                En réalité, alors qu'une transaction de change au comptant est effectuée au taux actuel du marché, 
                la transaction réelle n'est réglée que deux jours ouvrables après la date de transaction.
                </p>
                <p>
                C'est ce qu'on appelle T+2 ("Aujourd'hui plus 2 jours ouvrables").
                </p>
                <p>
                Cela signifie que la livraison de ce que vous achetez ou vendez doit être effectuée dans 
                les deux jours ouvrables et est appelée date de valeur ou date de livraison .
                </p>
                <p>
                Par exemple, une institution achète de l'EUR/USD sur le marché des changes au comptant.
                </p>
                <p>
                Le commerce ouvert et fermé le lundi a une date de valeur le mercredi. 
                Cela signifie qu'il recevra des euros mercredi.
                </p>
                <p>
                Cependant, toutes les devises ne règlent pas T+2. Par exemple, la date de valeur USD/CAD, USD/TRY,
                 USD/RUB et USD/PHP est T+1 , ce qui signifie un jour ouvrable à partir d'aujourd'hui (T).
                </p>
                <p>
                    <strong>Le trading sur le marché forex au comptant n'est PAS là où les commerçants de détail négocient.</strong>
                </p>

                <H3>Forex de détail</H3>

                <p>
                Il existe un marché secondaire de gré à gré qui permet aux commerçants de détail («plus pauvres») 
                de participer au marché des changes.
                </p>
                <p>
                L'accès est accordé par ce que l'on appelle les « <strong>fournisseurs de trading forex</strong> ».
                </p>
                <p>
                Les fournisseurs de trading Forex négocient en votre nom sur le marché OTC primaire.
                Ils trouvent les meilleurs prix disponibles, puis ajoutent une « majoration » 
                avant d'afficher les prix sur leurs plateformes de trading.
                </p>
                <p>
                Ceci est similaire à la façon dont un magasin de détail achète des stocks sur 
                un marché de gros, ajoute une majoration et affiche un prix « de détail » à ses clients.
                </p>
                <p>
                Bien qu'un contrat de change au comptant nécessite normalement la livraison de devises 
                dans les deux jours, dans la pratique, personne ne prend livraison de devises dans 
                le cadre du trading de devises.
                </p>
                <p>
                La position est « reportée » à la date de livraison.
                </p>
                <p>
                Surtout sur le marché forex de détail.
                </p>
                <p>
                N'oubliez pas que vous  négociez en fait un contrat pour livrer la devise sous-jacente, 
                plutôt que la devise elle-même.
                </p>
                <p>
                Ce n'est pas seulement un contrat, c'est un contrat à effet de levier .
                </p>
                <p>
                Les commerçants de forex de détail ne peuvent pas 
                "prendre ou faire livraison" sur les contrats de change au comptant à effet de levier.
                </p>
                <p>
                L'effet de levier vous permet de contrôler de grandes quantités de devises pour un très petit montant.
                </p>
                <p>
                Les courtiers forex de détail vous permettent de négocier avec un effet de levier , c'est pourquoi 
                vous pouvez ouvrir des positions évaluées à 50 fois le montant de la marge initiale requise .
                </p>
                <p>
                Ainsi, avec 2 000 $, vous pouvez ouvrir une transaction EUR/USD d'une valeur de 100 000 $.
                </p>
                <p>
                Imaginez si vous étiez à court d'EUR/USD et que vous deviez livrer pour 100 000 $ d'euros !
                </p>
                <p>
                Vous seriez incapable de régler le contrat en espèces puisque vous n'avez que 
                2 000 $ sur votre compte. Vous n'auriez pas assez de fonds pour couvrir la transaction !
                </p>
                <p>
                Vous devez donc soit fermer la transaction avant qu'elle ne se stabilise, 
                soit la « renouveler ».
                </p>
                <p>
                Pour éviter ce tracas de livraison physique, les courtiers de forex 
                de détail «roulent» automatiquement les positions des clients.
                </p>
                <p>
                C'est ainsi que vous évitez d'être obligé d'accepter (ou de livrer) 100 000 euros.
                </p>
                <p>
                Les transactions forex de détail sont clôturées en concluant une transaction 
                égale mais opposée avec votre courtier forex.
                </p>
                <p>
                Par exemple, si vous avez acheté des livres sterling avec des dollars américains, 
                vous clôtureriez la transaction en vendant des livres sterling contre des dollars américains.
                </p>
                <p>
                Ceci est également appelé  compensation ou liquidation d'une transaction.
                </p>
                <p>
                Si vous avez une position laissée ouverte à la clôture du jour ouvrable,
                elle sera automatiquement reconduite à la date de valeur suivante pour éviter 
                la livraison de la devise.
                </p>
                <p>
                    <strong>Votre courtier forex de détail continuera automatiquement 
                    à renouveler votre contrat au comptant pour vous indéfiniment jusqu'à ce qu'il soit clôturé.</strong>
                </p>
                <p>
                La procédure de roulement de la paire de devises est connue sous le nom de Tomorrow-Next 
                ou " Tom-Next ", qui signifie "Demain et le lendemain".
                </p>
                <p>
                Lorsque les positions sont reconduites, cela se traduit par des intérêts payés ou gagnés par le trader.
                </p>
                <p>
                Ces frais sont appelés frais de swap ou frais de roulement . Votre courtier forex calcule 
                les frais pour vous et débitera ou créditera le solde de votre compte .
                </p>
                <p>
                Le trading forex de détail est considéré comme spéculatif . Cela signifie que les commerçants essaient de 
                « <strong>spéculer</strong>» ou de faire des paris sur (et de tirer profit) du mouvement des taux de change. 
                Ils ne cherchent pas à prendre physiquement possession des devises qu'ils achètent ou à livrer les devises qu'ils vendent
                </p>
                
                <H3>Forex Spread Bet</H3>

                <p>
                Le spread betting est un produit dérivé, ce qui signifie que vous ne vous appropriez pas l'actif sous-jacent, 
                mais que vous spéculez sur la direction dans laquelle vous pensez que son prix augmentera ou baissera.
                </p>
                <p>
                Un <strong>pari de spread forex</strong> vous permet de spéculer sur la direction future des prix d'une paire de devises.
                </p>
                <p>
                Le prix d'une paire de devises utilisé sur le pari sur spread est « dérivé » du prix de la paire de devises 
                sur le marché des changes au comptant.
                </p>
                <p>
                Votre profit ou votre perte est dicté par la mesure dans laquelle le marché évolue 
                en votre faveur avant que vous ne fermiez votre position et le montant d'argent 
                que vous avez parié par "point" de mouvement de prix.
                </p>
                <p>
                Les spread betting sur le forex sont fournis par des « <strong>fournisseurs de spread betting</strong> ».
                </p>
                <p>
                Malheureusement, si vous vivez aux États-Unis, les spread betting sont considérés comme illégaux. 
                Bien qu'ils soient réglementés par la FSA au Royaume-Uni, les États-Unis considèrent le spread 
                betting comme un jeu sur Internet, ce qui est actuellement interdit.
                </p>

                <H3>CFD Forex</H3>

                <p>
                Un contrat sur différence ("CFD") est un dérivé financier. Les produits dérivés suivent 
                le prix du marché d'un actif sous-jacent afin que les traders puissent spéculer sur 
                la hausse ou la baisse du prix.
                </p>
                <p>
                Le prix d'un CFD est "dérivé" du prix de l'actif sous-jacent.
                </p>
                <p>
                Un CFD est un contrat, généralement entre un fournisseur de CFD et un trader,
                dans lequel une partie s'engage à payer à l'autre la différence de valeur d'un titre,
                entre l'ouverture et la clôture de la transaction.
                </p>
                <p>
                En d'autres termes, un CFD est essentiellement un pari sur un actif particulier dont la valeur
                augmente ou diminue, avec le fournisseur de CFD et vous acceptez que celui qui remporte 
                le pari paiera à l'autre la différence entre le prix de l'actif lorsque vous entrez 
                dans le commerce et son prix lorsque vous quittez le commerce.
                </p>
                <p>
                Un <strong>CFD forex</strong> est un accord ("contrat") pour échanger la différence de prix 
                d'une paire de devises entre le moment où vous ouvrez votre position et le moment où vous la fermez .
                </p>
                <p>
                Le prix CFD d'une paire de devises est "dérivé" du prix de la paire de devises sur 
                le marché des changes au comptant. (Ou du moins ça devrait l'être. Sinon, sur quoi 
                le fournisseur de CFD base-t-il son prix ? 🤔)
                </p>
                <p>
                Le trading de CFD forex vous donne la possibilité de trader une paire de devises 
                dans les deux sens. Vous pouvez prendre des positions longues et courtes .
                </p>
                <p>
                Si le prix évolue dans la direction que vous avez choisie, vous ferez un profit, 
                et s'il évolue contre vous, vous ferez une perte.
                </p>
                <p>
                Dans l'UE et au Royaume-Uni, les régulateurs ont décidé que 
                les «contrats de change au comptant glissants» sont différents du contrat de change au comptant traditionnel.
                </p>
                <p>
                La principale raison en est qu'avec les contrats de change au comptant glissants, il n'y a aucune intention 
                de prendre la livraison physique réelle ("prendre possession") d'une devise, son but est <strong>simplement de 
                spéculer sur le mouvement des prix dans la devise sous-jacente </strong>.
                </p>
                <p>
                L'objectif de la négociation d'un contrat de change au comptant glissant est de s'exposer 
                aux fluctuations de prix liées à la paire de devises sous-jacente sans la posséder réellement.
                </p>
                <p>
                Donc, pour clarifier cette différenciation, un contrat de change au comptant glissant 
                est considéré comme un CFD. (Aux États-Unis, les CFD sont illégaux, c'est ce qu'on appelle 
                une "transaction forex de détail")
                </p>
                <p>
                Le trading Forex CFD est fourni par des «<strong>seurs de CFD</strong>».
                </p>
                <p>
                En dehors des États-Unis, le trading forex de détail se fait généralement avec des CFD ou des spread bets.
                </p>            
            </section>
            
        </div>
        
    )
}
export default Lesson3
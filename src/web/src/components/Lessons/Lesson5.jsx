import '../styles/Lesson.css'
import {H1,H2,H3} from "@blueprintjs/core";
import school from '../../data/icons/school-icon-2.jpg'
import img2 from '../../data/images/lessons/lesson5/img2.png'
import img3 from '../../data/images/lessons/lesson5/img3.png'
import img4 from '../../data/images/lessons/lesson5/img4.png'
import img5 from '../../data/images/lessons/lesson5/img5.png'
import { Divider } from "@blueprintjs/core";

const Lesson5 = () =>{
    return (
        <div>
            <div className='centeredDiv'>
            
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <img  alt="Lesson5" src={school}/>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
                
            </div>
            <section style={{marginLeft:'250px',marginTop:'40px'}}>
                <H1>V- Quand acheter ou vendre?</H1>
                <H2>1- Savoir quand acheter ou vendre une paire de devises</H2>
                <p>
                Le trading Forex consiste à essayer de prédire quelle devise augmentera ou baissera par rapport à une autre devise.
                </p>
                <p>
                Comment savoir quand acheter ou vendre une paire de devises ?
                </p>
                <p>
                Dans les exemples suivants, nous allons utiliser une petite analyse fondamentale 
                pour nous aider à décider d'acheter ou de vendre une paire de devises spécifique .
                </p>
                <p>
                L'offre et la demande d'une devise changent en raison de divers facteurs économiques,
                ce qui fait monter et descendre les taux de change.
                </p>
                <p>
                Chaque devise appartient à un pays (ou une région). Ainsi, l'analyse fondamentale 
                du forex se concentre sur l'état général de l'économie du pays, comme la productivité,
                l'emploi, la fabrication, le commerce international et les taux d'intérêtzzzzzzzz.
                </p>
                <p>
                Réveillez-vous!
                </p>
                <p>
                Si vous vous êtes toujours endormi pendant votre cours 
                d'économie ou si vous avez simplement sauté un cours d'économie, ne vous inquiétez pas !
                </p>
                <p>
                Nous couvrirons l'analyse fondamentale dans une leçon ultérieure.
                </p>
                <img alt="Lesson5" className='image2' src={img2}/>
                <p>
                Mais en ce moment, essayez de prétendre que vous savez ce qui se passe…
                </p>

                <H3>EUR/USD</H3>
                <p>
                Dans cet exemple, l'euro est la devise de référence et donc la « base » de l'achat/vente.
                </p>
                <p>
                Si vous pensez que l' économie américaine continuera de s'affaiblir, ce qui est mauvais 
                pour le dollar américain, vous exécuterez un ordre <strong>BUY</strong> EUR/USD.
                </p>
                <p>
                Ce faisant, vous avez acheté des euros dans l'espoir qu'ils augmenteront par rapport au dollar américain.
                </p>
                <p>
                Si vous pensez que l'économie américaine est forte et que l'euro va s'affaiblir face au dollar américain, 
                vous exécuterez un ordre de <strong>VENTE</strong> EUR/USD.
                </p>

                <H3>USD/JPY</H3>
                <p>
                Dans cet exemple, le dollar américain est la devise de base et donc la « base » de l'achat/vente.
                </p>
                <p>
                Si vous pensez que le gouvernement japonais va affaiblir le yen afin d'aider son industrie
                 d'exportation, vous exécuterez un ordre <strong>BUY</strong> USD/JPY.
                </p>
                <p>
                Ce faisant, vous avez acheté des dollars américains dans l'espoir qu'ils augmenteront par rapport au yen japonais.
                </p>
                <p>
                Si vous pensez que les investisseurs japonais retirent de l'argent des marchés financiers américains et convertissent
                tous leurs dollars américains en yens, et que cela nuira au dollar américain, vous exécuterez un ordre <strong>SELL</strong> USD/JPY.
                </p>
                <p>
                Ce faisant, vous avez vendu des dollars américains dans l'espoir qu'ils se déprécient par rapport au yen japonais.
                </p>

                <H3>GBP/USD</H3>

                <p>
                Dans cet exemple, la livre est la devise de base et donc la « base » de l'achat/vente.
                </p>
                <p>
                Si vous pensez que l'économie britannique continuera à faire mieux que les États-Unis 
                en termes de croissance économique, vous exécuterez un ordre <strong>BUY</strong> GBP/USD.
                </p>
                <p>
                Ce faisant, vous avez acheté des livres dans l'espoir qu'elles augmenteront par rapport au dollar américain.
                </p>
                <p>
                Si vous pensez que l'économie britannique ralentit alors que l'économie américaine reste forte 
                comme Chuck Norris, vous exécuterez un ordre <strong>SELL</strong> GBP/USD.
                </p>
                <p>
                Ce faisant, vous avez vendu des livres dans l'espoir qu'elles se déprécient par rapport au dollar américain.
                </p>

                <H3>Comment trader le forex avec USD/CHF</H3>

                <p>
                Dans cet exemple, le dollar américain est la devise de base et donc la « base » de l'achat/vente.
                </p>
                <p>
                Si vous pensez que le franc suisse est surévalué, vous exécuterez un ordre <strong>BUY</strong> USD/CHF.
                </p>
                <p>
                Ce faisant, vous avez acheté des dollars américains dans l'espoir 
                qu'ils s'apprécieront par rapport au franc suisse.
                </p>
                <p>
                Si vous pensez que la faiblesse du marché immobilier américain nuira à la croissance économique future,
                ce qui affaiblira le dollar, vous exécuterez un ordre de <strong>SELL</strong> USD/CHF.
                </p>
                <p>
                Ce faisant, vous avez vendu des dollars américains dans l'espoir qu'ils se déprécient par rapport au franc suisse.
                </p>

                <H3>Négociation en "lots"</H3>
                <p>
                Lorsque vous allez à l'épicerie et que vous voulez acheter un œuf, vous ne pouvez pas acheter un seul œuf, 
                il en existe des dizaines ou des "lots" de 12.
                </p>
                <p>
                Dans le forex, il serait tout aussi insensé d'acheter ou de vendre 1 euro, donc ils viennent généralement 
                en "lots" de <strong>1 000</strong> unités de devise (micro lot), <strong>10 000</strong> unités (mini lot) ou <strong>100 000</strong> unités (lot standard) 
                selon votre courtier et le type de compte que vous avez (plus sur les "lots" plus tard).
                </p>

                <H3>Marge de négociation</H3>
                <p>
                <strong>« Mais je n'ai pas assez d'argent pour acheter 10 000 euros ! Puis-je encore échanger ? »</strong>
                </p>
                <p>
                Tu peux! En utilisant l' effet de <strong>levier</strong> .
                </p>
                <p>
                Lorsque vous négociez avec un effet de levier, vous n'avez pas besoin de payer les 10 000 euros 
                à l'avance. Au lieu de cela, vous feriez un petit « acompte », appelé <strong>marge</strong> .
                </p>
                L'effet de levier est le rapport entre la taille de la transaction («taille de la position») 
                et l'argent réel («capital commercial») utilisé pour la marge.
                <p>
                Par exemple, un effet de <strong>levier de 50:1</strong> , également connu sous le nom d' <strong>exigence de marge de 2 %</strong>
                , signifie qu'une marge de 2 000 $ est nécessaire pour ouvrir une position d'une valeur de 100 000 $.
                </p>
                <p>
                <strong>Le trading sur marge</strong> vous permet d'ouvrir des positions importantes en utilisant 
                seulement une fraction du capital dont vous auriez normalement besoin.
                </p>
                <p>
                C'est ainsi que vous pouvez ouvrir des positions de 1 250 $ ou 50 000 $ avec aussi peu que 25 $ ou 1 000 $.
                </p>
                <p>
                <strong>Vous pouvez effectuer des transactions relativement importantes avec un petit capital initial.</strong>Vous pouvez effectuer des transactions relativement importantes avec un petit capital initial.
                </p>
                <p>
                Expliquons-nous.
                </p>
                <p>
                Nous discuterons de la marge plus en détail plus tard, 
                mais j'espère que vous pourrez avoir une idée de base de son fonctionnement.
                </p>
                <p>
                Écoute bien car c'est très important ! 
                </p>
                <p>
                    <ul>
                        <li>- Vous croyez que des signaux sur le marché indiquent que la livre sterling 
                        s'appréciera par rapport au dollar américain.</li>
                        <li>- Vous ouvrez un lot standard (100 000 unités GBP/USD),
                         en achetant avec la livre sterling avec une <strong>exigence de marge de 2 %</strong>.</li>
                         <li>- Vous attendez que le taux de change grimpe.</li>
                         <li>- Lorsque vous achetez un lot (100 000 unités) de GBP/USD au prix de 1,50000, 
                         vous achetez 100 000 livres, ce qui vaut 150 000 $ (100 000 unités de GBP * 1,50000).</li>
                         <li>- Étant donné que l'exigence de marge était de 2 %, 3 000 USD seraient mis 
                         de côté sur votre compte pour ouvrir la transaction (150 000 $ * 2 %).</li>
                         <li>- <strong>Vous contrôlez maintenant 100 000 livres avec seulement 3 000 $</strong>. </li>
                         <li>Vos prédictions se réalisent et vous décidez de vendre. Vous fermez la position 
                         à 1,50500. Vous gagnez environ 500 $.</li>
                    </ul>
                </p>
                <p>
                <img alt="Lesson5" className='image3' src={img3}/>
                </p>
                <p>
                Lorsque vous décidez de fermer une position, le dépôt ("marge") que vous avez effectué 
                à l'origine vous est restitué et un calcul de vos profits ou pertes est effectué.
                </p>
                <p>
                Ce profit ou cette perte est ensuite crédité sur votre compte.
                </p>
                <p>
                Passons en revue l'exemple d'échange GBP/USD ci-dessus.
                </p>
                <p>
                    <ul>
                        <li>- Le GBP/USD a augmenté d'à peine un demi-centime ! Pas même un centime. C'était un demi-centime !</li>
                        <li>- Mais vous avez gagné 500 $ ! 😲</li>
                        <li>- En faisant une sieste éclair !</li>
                        <li>- Comment? Parce que vous ne négociez pas seulement 1 £.</li>
                        <li>- Mais… la taille de votre position était de 100 000 £ (ou 150 000 $) lorsque vous avez ouvert la transaction.</li>
                        <li>- Ce qui est bien, c'est que vous n'avez pas eu à verser tout ce montant.</li>
                        <li>- Tout ce qui était nécessaire pour ouvrir la transaction était de 3 000 $ de marge.</li>
                        <li>- Un profit de 500 $ sur un capital de 3 000 $ représente un rendement de 16,67 % ! 😲😲</li>
                        <li>- En vingt minutes !</li>
                        <li>- C'est le pouvoir du trading à effet de levier !</li>
                    </ul>
                </p>
                <p>
                    <strong>Un petit dépôt de marge peut entraîner des pertes importantes ainsi que des gains.</strong>
                </p>
                <p>
                Cela signifie également qu'un mouvement relativement faible peut entraîner un mouvement proportionnellement 
                beaucoup plus important de la taille de toute perte ou profit qui peut jouer contre vous aussi bien que pour vous.
                </p>
                <p>
                    <strong style={{color:"red"}}> Vous auriez également pu facilement PERDRE 500 $ en vingt minutes.</strong>
                </p>
                <img alt="Lesson5"className='image4' src={img4}/>

                <p>
                Tu ne te serais pas réveillé  d' un cauchemar. Vous vous seriez réveillé dans un cauchemar !
                </p>
                <p>
                Un effet de levier élevé semble génial, mais il peut être mortel.
                </p>
                <p>
                Par exemple, vous ouvrez un compte de trading forex avec un petit dépôt de 1 000 $. 
                Votre courtier offre un effet de levier de 100:1, vous ouvrez donc une position EUR/USD de 100 000 $.
                </p>
                <p>
                Par exemple, un effet de <strong>levier de 50:1</strong> , également connu sous le nom d' <strong>exigence de marge de 2 %</strong>
                , signifie qu'une marge de 2 000 $ est nécessaire pour ouvrir une position d'une valeur de 100 000 $.
                </p>
                <p>
                Un mouvement de seulement 100 pips amènera votre compte à 0 $ ! Un mouvement de 100 pips équivaut à  1€ ! 
                Vous avez fait exploser votre compte avec un mouvement de prix d'un seul euro. Félicitations. 👏
                </p>

                <H3>Rouler</H3>
                <p>
                Pour les positions ouvertes à «l'heure limite» de votre courtier (généralement 17h00 HE), 
                il y a des « frais de roulement » quotidiens , également appelés « frais de swap » qu'un commerçant paie ou gagne, 
                selon les positions vous avez ouvert.
                </p>
                <p>
                Si vous ne voulez pas gagner ou payer d'intérêts sur vos positions, 
                assurez-vous simplement qu'elles sont toutes fermées avant 17h00 HE, la fin établie du jour du marché.
                </p>
                <p>
                Étant donné que chaque transaction de devises implique d'emprunter une devise pour en acheter une autre,
                 les frais de report d'intérêts font partie du trading de devises .
                </p>
                <p>
                <strong>Les intérêts sont PAYÉS sur la devise empruntée.</strong>
                </p>
                <p>
                <strong>L'intérêt est GAGNÉ sur celui qui est acheté.</strong>
                </p>
                <p>
                Si vous achetez une devise avec un taux d'intérêt plus élevé que celui que vous empruntez, 
                le différentiel de taux d'intérêt net sera positif (c'est-à-dire USD/JPY ) et vous gagnerez des intérêts en conséquence.
                </p>
                <p>
                A l'inverse, si le différentiel de taux d'intérêt est négatif alors vous devrez payer .
                </p>
                <p>
                Notez que de nombreux courtiers forex de détail ajustent leurs taux de roulement 
                en fonction de différents facteurs (par exemple, l'effet de levier du compte, les taux de prêt interbancaires).
                </p>
                <p>
                Veuillez consulter votre courtier pour plus d'informations 
                sur ses taux de roulement spécifiques et ses procédures de crédit/débit.
                </p>
                <p>
                Voici un tableau pour vous aider à comprendre les différentiels de taux d'intérêt des principales devises.
                </p>

                <H3>Taux d'intérêt de la Banque centrale</H3>
                <p>
                <img alt="Lesson5" className='image5' src={img5}/>
                </p>
                <p>
                Plus tard, nous vous expliquerons comment utiliser les différentiels de taux d'intérêt à votre avantage.
                </p>
            </section>
            
        </div>
        
    )
}
export default Lesson5
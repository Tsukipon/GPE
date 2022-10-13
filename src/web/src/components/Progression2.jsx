import './styles/Progression.css'
import {H1} from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { Button, ButtonGroup, Divider} from "@blueprintjs/core";

const Progression = () =>{
    const history = useHistory();

    return (
        <div className="body_progression">
            <div className='centeredDiv'>
                <H1> ForexMectrics Academia</H1>
                <p className='header-text'>
                    Bienvenu(e) ! Êtes-vous nouveau dans le trading forex ? 
                </p>
                <p className='header-text'>
                    L'école ForexMetrics Academia est notre 
                    répertoire de cours en ligne gratuit qui aide les débutants à apprendre à trader le forex. 
                    Si vous avez toujours voulu apprendre à trader mais que vous ne savez pas par où commencer, 
                    ce cours est fait pour vous.
                </p>
                <Divider style={{'width':'75%'}}/>
            </div>
            
            <div className="container_progression">
                <section className="section_progression">
                    <h1>Module Général : Formation Débutants</h1>
                    <h2>Leçons débutants</h2>
                    <h3>Introduction</h3>
                    <p>
                        Ce module est divisé en 6 parties. Du préscolaire au lycée nous verrons les bases du Forex, 
                        comment on trade le Forex et les types de graphiques qu'on peut trouver un peu partout. Ces cours ont été soigneusement écrit pour vous aider à 
                        comprendre les méchaniques qui régissent le marché Forex et à commencer à trader.
                        

                    </p>
                    <h2> Vos statistiques</h2>
                    <div class="container_progression">
                        <div class="card_progression">
                            <h3 class="title">Préscolaire</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Introduction au forex" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/Lesson1/")}/>
                                <Divider />        
                                <Button text="Introduction au trading forex" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/Lesson2/")}/>
                                <Divider />        
                                <Button text="Comment tradez-vous le Forex ?" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/Lesson3/")}/>
                                <Divider />        
                                <Button text="Le trading et le forex" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/Lesson4/")}/>
                                <Divider />
                                <Button text="Quand acheter ou vendre?" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/Lesson5/")}/>
                                <Divider />
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">École maternelle</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Les brokers" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Les trois types d'analyses" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Types de graphiques" style={{color:'white',textAlign:'center'}}/>

                                <Divider/>
                            </ButtonGroup>
                            </div>
                            
                        </div>
                        <div class="card_progression">
                            <h3 class="title">École primaire</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Support et niveaux de résistance" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Les graphes chandeliers" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Fibonacci" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Moyennes mobiles" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Les indicateurs populaires" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        
                        
                    </div>
                </section>
                <section className="section_progression">
                    <h1>Module Expertise : Formation Avancée</h1>
                    <h2>Leçons avancés</h2>
                    <h3>Introduction</h3>
                    <p>
                        Ce module est divisé en 6 parties. Préparez vous car cela va devenir un peu matheux. Et oui pas d'échapatoire, l'analyse de Forex
                        c'est beaucoup de maths.Cela dis, pas d'inquiétudes, nous vous montrerons les rouages de l'analyse de Forex et comment vous pouvez investir
                        en minimisant les risques de pertes.
                    </p>
                    <h2> Vos statistiques</h2>
                    
                    <div class="container_progression">
                        <div class="card_progression">
                            <h3 class="title">Premier cycle - Première année</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Sentiment du marché " style={{color:'white',textAlign:'center'}}/>
                                <Button text="Le trading des informations" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Le Carry Trade" style={{color:'white',textAlign:'center'}}/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">Premier cycle - Deuxième année</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="L'index du dollars américain" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Correlations intermarchés" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Utiliser des actions pour négocier des devises" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Profile des pays" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">Premier cycle - Junior</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Développez votre propre plan de trading" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Quel type de trader êtes vous ?" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Créez votre propre système de trading" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Entretenir un journal de trading" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        
                    </div>
                </section>
                
            </div>
            <div className="container_progression">
                <section className="section_progression">
                    <div class="container_progression" style={{'marginTop': '340px'}}>
                        <div class="card_progression">
                            <h3 class="title">École intermédiaire</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Oscillateurs et indicateurs de momentum" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/")}/>
                                <Button text="Importants patternes graphiques" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/")}/>
                                <Divider />
                                <Button text="Les points de pivot" style={{color:'white',textAlign:'center'}}
                                        onClick={() => history.push("/")}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">École d'été</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Heikin Ashi" style={{color:'white',textAlign:'center'}}/>
                                <Button text="La théorie des vagues d'Elliott" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Les patternes de prix harmoniques" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">Lycée</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Divergences" style={{color:'white',textAlign:'center'}}/>
                                <Button text="L'environnement du marché" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Évasions et contrefaçons de trading" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Analyse fondamentale" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Devises croisées" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Analyse de périodes multiples" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        
                        
                    </div>
                </section>
                <section className="section_progression">  
                    <div class="container_progression" style={{'marginTop': '340px'}}>
                        <div class="card_progression">
                            <h3 class="title">Premier cycle - Sénior</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Gérer le risque" style={{color:'white',textAlign:'center'}}/>
                                <Button text="La cause numéro 1 de l'échec des traders" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Estimation de la position" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Les ordres Stop-Losses" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Principe du Scaling In and Out" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Correlations des devises" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">Diplomé</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Les erreurs les plus courantes des nouveaux traders" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Les arnaques du trading de Forex" style={{color:'white',textAlign:'center'}}/>
                                <Divider />
                                <Button text="Quizz de personnalité" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Discours d'obtention de diplôme" style={{color:'white',textAlign:'center'}}/>
                                <Divider/>
                            </ButtonGroup>
                            </div>
                        </div>
                        <div class="card_progression">
                            <h3 class="title">Conseilles de vétéran</h3>
                            <div class="bar">
                                <div class="emptybar"></div>
                                <div class="filledbar"></div>
                            </div>
                            <div style={{'color':'white'}}>
                            <ButtonGroup minimal={true} vertical={true} style={{'marginTop':'120px','color':'white'}}>
                                <Button text="Comment utiliser l'application efficacement" style={{color:'white',textAlign:'center'}}/>
                                <Button text="Quel avantages à devenir membre premium" style={{color:'white',textAlign:'center'}}/>
                            </ButtonGroup>
                            </div>
                        </div>               
                    </div>
                </section>
                
            </div>
        </div>
    )
}
export default Progression
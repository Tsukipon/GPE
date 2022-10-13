import { Switch, Route } from "react-router-dom";
import {
  Button,
  HTMLTable,
  InputGroup,
  // Tag,
  // TagInput,
  H2,H4,H6,
  FormGroup,
  RadioGroup,
  Radio,
  Icon,
  NumericInput,
  Switch as BSwitch,
  Colors,
  TextArea,HTMLSelect, Dialog,Divider 
} from "@blueprintjs/core";
import ReactTooltip from 'react-tooltip';
import "@blueprintjs/datetime";
import "./index.scss";
import { useState } from "react";
import { DatePicker } from "@blueprintjs/datetime";
import {
  INTENT_PRIMARY,
  INTENT_SUCCESS,
} from "@blueprintjs/core/lib/esm/common/classes";
import { useDispatch , useSelector } from "react-redux";
import { createAlerte, DeleteAlert, GetListAlert, ModifyAlert, GetListFollowedAlert } from "../../store/reducers/alert.reducer";
import GridLayout from "react-grid-layout";
import Select from 'react-select'
import {CURRENCIES} from "../../components/dashboard/currencies"; 



const AlertOverview = () => {
  const showTooltips = localStorage.getItem("skill") === "beginner";
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [followedData, setFollowedData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);


  dispatch(GetListAlert()).then(request =>{
    if(!data) {
      setData(request)
    }
  });

  dispatch(GetListFollowedAlert()).then(request =>{
    if(!followedData) {
      setFollowedData(request)
    }
  });


  const alerts = useSelector((state) => state.alert.alerts)
  const followedAlerts = useSelector((state) => state.alert.followed_alerts)
  //const [data, setData] = useState(null);

  console.log(followedAlerts);
  
  const handleChangeActiveStatus = (event , alert) =>{
    for (let i=0;i< alert.triggers.length;i++){
      alert.triggers[i].is_active = true
    }
    alert.is_active = !alert.is_active;
    dispatch(ModifyAlert(alert))
    //console.log(alerts);
    window.location.reload()
  }

  const handleDelete = (event , alertName ) =>{
    dispatch(DeleteAlert(alertName))
    window.location.reload()
  }

  const handleDisplayDescription =(event,alert) => {
    toggleOverlay();
    setSelectedAlert(alert);
  }
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  }


  return (
    <div>
      {showTooltips && <ReactTooltip id="normal" /> }
      {showTooltips && <ReactTooltip id='visibility'>
        <p>La visibilité de l'alerte</p>
        <p>Il y'a trois niveaux :</p>
        <ul>
          <li>private : l'alerte est privée et n'est visible que par vous</li>
          <li>limited : l'alerte est restreinte aux followers qui ont votre mot de passe secret</li>
          <li>public : l'alerte est visible par tous vos followers</li>
        </ul>
        </ReactTooltip> }
      
      <form></form>
      <H2 className="center top-margin"> Mes alertes </H2>
      <div className="row" style={{ marginTop: "15px" }}>
        <div className="col-md-12">
          <HTMLTable style={{ width: "100%" }}>
            <thead>
              <tr>
                
                <th data-tip="Le nom de l'alerte" data-for="normal"> Nom </th>
                <th data-tip="Par quel moyen l'alerte envera une notification " data-for="normal"> Notification </th>
                <th data-tip data-for="visibility"> Visibilité </th>
                <th 
                  data-tip="La date d'expiration de l'alerte. Si le champ est vide, cela veut dire que l'alerte n'expire pas."
                  data-for="normal">
                  Date d'expiration 
                </th>
                <th data-for="normal" data-tip="La paire de devise d'interêt de l'alerte. Devise 1 => Devise 2"> Paire de devises </th>
                <th data-for="normal" data-tip="Le statut de l'alerte. Rouge indique que l'alerte est désactivée et Vert indique que l'alerte est activée"> Statut </th>
                <th data-for="normal" data-tip="Différentes actions sur l'alerte (détails , activer/désactiver, suppression)"> Actions </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.alert_name}>
                  <td>{alert.alert_name}</td>
                  <td>{alert.alerting_device}</td>
                  <td>{alert.protection_level}</td>
                  <td>{alert.expiration_date}</td>
                  <td>{alert.currency_pair_id}</td>
                  
                  <td><Icon icon="record" style={{ color: alert.is_active? Colors.GREEN2 : Colors.RED2 }}/> </td>
                  <td><Button data-for="normal" data-tip="Afficher les détails" icon="list-detail-view" 
                              onClick={(event) => handleDisplayDescription(event,alert)}>
                      </Button>
                  <Button data-for="normal" data-tip="Inverser le statut" icon="refresh" onClick= {(event) => handleChangeActiveStatus(event,alert)}></Button>
                  <Button data-for="normal" data-tip="Supprimer l'alerte" intent="danger" icon="trash" onClick= {(event) => handleDelete(event,alert.alert_name)}></Button></td>
                  </tr> 
                ))}
              </tbody>
            </HTMLTable>
            

        </div>
        
      </div>

      <H2 className="center top-margin"> Alertes partagées </H2>

      <div className="row" style={{ marginTop: "15px" }}>
        <div className="col-md-12">
          <HTMLTable style={{ width: "100%" }}>
            <thead>
              <tr>
                <th> Nom </th>
                <th> Notification </th>
                <th> Visibilité </th>
                <th> Date d'expiration </th>
                <th> Paire de devises </th>
                <th> Statut </th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
            {(followedAlerts && Object.keys(followedAlerts).length!==0) && followedAlerts.map((alert) => (
                <tr key={alert.alert_name}>
                  <td>{alert.alert_name}</td>
                  <td>{alert.alerting_device}</td>
                  <td>{alert.protection_level}</td>
                  <td>{alert.expiration_date}</td>
                  <td>{alert.currency_pair_id}</td>
                   
                  <td><Icon icon="record" style={{ color: alert.is_active? Colors.GREEN2 : Colors.RED2 }}/> </td>
                  <td> <Button icon="list-detail-view" onClick={(event) => handleDisplayDescription(event,alert)}></Button>
                  <Button disabled icon="refresh" onClick= {(event) => handleChangeActiveStatus(event,alert)}></Button>
                  <Button intent="danger" disabled icon="trash" onClick= {(event) => handleDelete(event,alert.alert_name)}></Button></td>
                  </tr> 
                ))}
            </tbody>
          </HTMLTable>

        </div>
      </div> 
      <Dialog isOpen={showOverlay} onClose={toggleOverlay} >
        <div style={{margin: 10}}>
            <H2> <bold>Nom :</bold> {selectedAlert?.alert_name}</H2>
            <Divider/>
            <H4> <bold>Statut :</bold> {selectedAlert?.is_active? "Activée" : "Désactivée"}</H4>
            <Divider/>
            <H4> <bold>Visibilité :</bold> {selectedAlert?.protection_level }</H4>
            <Divider/>
            <H4> <bold>Description :</bold></H4>
              <p>{selectedAlert?.description}</p>
        </div>
            

      </Dialog>
    </div>
    
  );
};

const AlertAdd = () => {
  const showTooltips = localStorage.getItem("skill") === "beginner";
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [alerting_device, setDevice] = useState("e-mail");
  const [expire, setExpire] = useState(false);

  const date = new Date();
  const [expiration_date, setExpirationDate] = useState(date);

  const [currency_pair, setCurrencyPair] = useState("");
  const [is_active, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [privacy_level, setPrivacy_level] = useState("private");
  const [condition1, setCondition1] = useState("ask");
  const [condition2, setCondition2] = useState("ask");
  const [condition3, setCondition3] = useState("ask");
  const [conditionType1, setConditionType1] = useState("bigger than")
  const [conditionType2, setConditionType2] = useState("bigger than")
  const [conditionType3, setConditionType3] = useState("bigger than")
  const [conditionValue1, setConditionValue1] = useState(0);
  const [conditionValue2, setConditionValue2] = useState(0);
  const [conditionValue3, setConditionValue3] = useState(0);


  console.log(condition2,condition3,conditionType2,conditionType3)
  //const { innerWidth: width, innerHeight: height } = window;

  const handleSubmit = (event) => {
    dispatch(createAlerte(name, alerting_device,expire,expiration_date,currency_pair,
      is_active,description,condition1,conditionType1,conditionValue1,privacy_level)).then(request => {
        window.location.href='/alert';
        
      })
      .catch(error => {
        console.log(error);
      });
    event.preventDefault();
  };

  return (
    <div>
    {showTooltips && <ReactTooltip />}
    <form className = "left">
    <H4 className="top-margin"> Créer une nouvelle alerte </H4>
      <GridLayout className="layout" cols={6} rowHeight={30} width={1400}>
        <div key="alertSettings" className="setting" data-grid={{ x: 0, y: 0, w: 2, h: 15, static: true }}>
          <div className="static-content">
          <H4 className="center"> Configuration générale </H4>
          <FormGroup label={"Nom de l'alerte"}>
            <InputGroup
              style={{ width: "50%" }}
              placeholder="Nom de l'alerte"
              leftIcon="edit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup label={"Mode de notification"}>
            <RadioGroup
              onChange={(e) => setDevice(e.target.value)}
              selectedValue={alerting_device}
            >
              <Radio label="E-mail" value="e-mail" />
              <Radio label="SMS" value="sms" />
            </RadioGroup>
          </FormGroup>
          <FormGroup label={"Niveau de visibilité"}>
            <RadioGroup
              onChange={(e) => setPrivacy_level(e.target.value)}
              selectedValue={privacy_level}
            >
              <Radio label="Privé" value="private" />
              <Radio label="Limité (Premium only)" value="limited" />
              <Radio label="Public" value="public" />
            </RadioGroup>
          </FormGroup>
          <FormGroup style={{ width: "50%" }} label={"Paire de devises"}>
            <Select options={CURRENCIES} onChange={(e) => setCurrencyPair(e.value)}/>
          </FormGroup>
          <FormGroup label="Description">
            <TextArea
              growVertically={true}
              large={true}
              intent={INTENT_PRIMARY}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </FormGroup>
          </div>
        </div>

          <div key="triggerSettings" className="setting" data-grid={{ x: 2, y: 0, w: 3, h: 10, static: true }}>
            
          <H4 className="center" data-tip="Les triggers représentes les conditions de déclanchement de l'alerte. Si tous les triggers sont actionnés, l'alerte est déclanchée.">
             Configuration des triggers 
          </H4>

          <H6 style={{margin:10}}>En tant que membre premium, vous pouvez ajouter jusqu'à 3 triggers* </H6>
          <GridLayout className="layout" cols={3} rowHeight={90} width={600}>
            <div key="trigger1" className="triggers" data-grid={{ x: 0, y: 0, w: 1, h: 3, static: true }}>
              
              <div className="trigger-content">
                  <H4 className="center">Obligatoire</H4>
                <FormGroup>
                <H6> Condition sur :</H6>
                <HTMLSelect onChange={(e) => setCondition1(e.target.value)}>
                  <option value="ask">Ask</option>
                  <option value="bid">Bid</option>
                  <option value="bid">Trading Moyenne Mobile Simple (MMS)</option>
                  <option value="bid">Trading Moyenne Mobile Exponentielle (MME)</option>
                  <option value="bid">Trading MACD (Moving Average Convergence Divergence)</option>
                  <option value="bid">Indice de Force Relative (RSI) </option>
                </HTMLSelect>
                </FormGroup>
                <FormGroup>
                <H6> Type de condition :</H6>
                <HTMLSelect onChange={(e) => setConditionType1(e.target.value)}>
                  <option value="bigger than">Supérieur à</option>
                  <option value="lesser than">Inférieur à</option>
                  <option value="crossing"> Crossing </option>
                  <option value="upcrossing">Up Crossing </option>
                  <option value="downcrossing">Down Crossing </option>
                  
                </HTMLSelect>
                </FormGroup>
                
                <FormGroup>
                <H6> Valeur : </H6>
                <NumericInput style={{ width: "50%" }} buttonPosition="none" value={conditionValue1} onValueChange  = {(e) => setConditionValue1(e)}>
                </NumericInput>
                </FormGroup>
              </div>
              
            </div>

            <div key="trigger2" className="triggers" data-grid={{ x: 1, y: 0, w: 1, h: 3, static: true }}>
            <div className="trigger-content">
                  <H4 className="center">Optionnel</H4>
                <FormGroup>
                <H6> Condition sur :</H6>
                <HTMLSelect onChange={(e) => setCondition2(e.target.value)}>
                  <option value="ask">Ask</option>
                  <option value="bid">Bid</option>
                  <option value="bid">Trading Moyenne Mobile Simple (MMS)</option>
                  <option value="bid">Trading Moyenne Mobile Exponentielle (MME)</option>
                  <option value="bid">Trading MACD (Moving Average Convergence Divergence)</option>
                  <option value="bid">Indice de Force Relative (RSI) </option>
                </HTMLSelect>
                </FormGroup>
                <FormGroup>
                <H6> Type de condition :</H6>
                <HTMLSelect onChange={(e) => setConditionType2(e.target.value)}>
                  <option value="bigger than">Supérieur à</option>
                  <option value="lesser than">Inférieur à</option>
                  <option value="crossing"> Crossing </option>
                  <option value="upcrossing">Up Crossing </option>
                  <option value="downcrossing">Down Crossing </option>
                </HTMLSelect>
                </FormGroup>
                
                <FormGroup>
                <H6> Valeur : </H6>
                <NumericInput style={{ width: "50%" }} buttonPosition="none" value={conditionValue2} onValueChange  = {(e) => setConditionValue2(e)}>
                </NumericInput>
                </FormGroup>
              </div>
            </div>
            <div key="trigger3" className="triggers" data-grid={{ x: 2, y: 0, w: 1, h: 3 ,static: true}}>
            <div className="trigger-content">
                  <H4 className="center">Optionnel</H4>
                <FormGroup>
                <H6> Condition sur :</H6>
                <HTMLSelect onChange={(e) => setCondition3(e.target.value)}>
                  <option value="ask">Ask</option>
                  <option value="bid">Bid</option>
                  <option value="bid">Trading Moyenne Mobile Simple (MMS)</option>
                  <option value="bid">Trading Moyenne Mobile Exponentielle (MME)</option>
                  <option value="bid">Trading MACD (Moving Average Convergence Divergence)</option>
                  <option value="bid">Indice de Force Relative (RSI) </option>
                </HTMLSelect>
                </FormGroup>
                <FormGroup>
                <H6> Type de condition :</H6>
                <HTMLSelect onChange={(e) => setConditionType3(e.target.value)}>
                  <option value="bigger than">Supérieur à</option>
                  <option value="lesser than">Inférieur à</option>
                  <option value="crossing"> Crossing </option>
                  <option value="upcrossing">Up Crossing </option>
                  <option value="downcrossing">Down Crossing </option>
                </HTMLSelect>
                </FormGroup>
                
                <FormGroup>
                <H6> Valeur : </H6>
                <NumericInput style={{ width: "50%" }} buttonPosition="none" value={conditionValue3} onValueChange  = {(e) => setConditionValue3(e)}>
                </NumericInput>
                </FormGroup>
              </div>
            </div>
          </GridLayout>

          </div>

          <div key="expirationSettings" className="setting" data-grid={{ x: 2, y: 10, w: 3, h: 5 ,static: true}}>
            <div className="static-content">
            <H4 className="center"> Configuration d'expiration </H4>
            <FormGroup>
            <H6>Expiration de l'alerte</H6>
            <BSwitch
              label="Expire"
              checked={expire}
              onChange={(e) => setExpire(!expire)}
            ></BSwitch>
            </FormGroup>
            {expire && (
              <DatePicker
                showActionsBar={true}
                timePrecision="minute"
                value={expiration_date}
                onChange={(e) => setExpirationDate(e)}
              ></DatePicker>
            )}
            <FormGroup>
              <BSwitch
                label="Activée dès la création"
                checked={is_active}
                onChange={(e) => setIsActive(!is_active)}
              ></BSwitch>
            </FormGroup>
            </div>
          </div>


      </GridLayout>
     
      <Button
        intent={INTENT_SUCCESS}
        type="submit"
        text="Valider"
        onClick={handleSubmit}
      />
    </form>
    </div>
  );
};


export const AlertPage = () => {
  return (
    <>
      <Switch>
        <Route path={"/alert"} exact component={AlertOverview} />
        <Route path={"/alert/add"} exact component={AlertAdd} />
      </Switch>
    </>
  );
};

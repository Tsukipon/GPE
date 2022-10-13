import {Layout} from "react-grid-layout"
import GridLayout from "react-grid-layout";
import '../../components/styles/Dashboard.css'
import _ from "lodash";
import { AppToaster } from "../../components/Toaster";
import {Button,H2,FormGroup,Checkbox,Collapse,Switch as BSwitch,} from "@blueprintjs/core";
import { useState } from "react";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ItemBox from "../../components/dashboard/ItemBox";
import ReactTooltip from 'react-tooltip';


const Dashboard = () => {
const showTooltips = localStorage.getItem("skill") === "beginner";
const [isOpen, setIsOpen] = useState(true);
const [editMode,setEditMode] = useState(true);
const [saveMode,setSaveMode] = useState(false);
const [compact,setCompact] = useState(true)

const savedCounter = getCounterFromLs()||0;
const [newCounter, setNewCounter] = useState(savedCounter);

const originalLayouts = getFromLS("layout") || [];
const [layout, setLayout] = useState<any[]>(JSON.parse(JSON.stringify(originalLayouts)));

//const [layouts, setLayouts] = useState({lg: items})
//const [layouts, setLayouts] = useState(JSON.parse(JSON.stringify(originalLayouts)))




//function called by clicking the button
const onAddSmallItem =() =>{
  //console.log("adding", "n" + newCounter);
  setLayout( layout => [...layout,{
    i: "n" + newCounter,
    x: compact? 0: Infinity,
    y: compact? Infinity: 0,
    w: 3,
    h: 10,
    minH:10,
    minW:2,
    maxH:14,
    maxW:5,
    static: false
  }]);
  setNewCounter( newCounter+1)
  AppToaster.show({ message: "New Block Added", intent: "success" });
}

const onAddBigItem =() =>{
  //console.log("adding", "n" + newCounter);
  setLayout( layout => [...layout,{
    i: "n" + newCounter,
    x: 0,
    y: Infinity,
    w: 7,
    h: 15,
    minH:15,
    minW:5,
    maxH:20,
    maxW:9,
    static: false
  }]);
  setNewCounter( newCounter+1)
  AppToaster.show({ message: "New Block Added", intent: "success" });
}

const onAddBiggestItem =() =>{
  //console.log("adding", "n" + newCounter);
  setLayout( layout => [...layout,{
    i: "n" + newCounter,
    x: 0,
    y: Infinity,
    w: 8,
    h: 20,
    minH:20,
    minW:7,
    maxH:25,
    maxW:16,
    static: false
  }]);
  setNewCounter( newCounter+1)
  AppToaster.show({ message: "New Block Added", intent: "success" });
}

const onRemoveItem= (i:any) => {
  //console.log("removing", i);
  setLayout( layout => _.reject(layout,{i:i}))
}

const onLockItem = (i:any) => {
  //console.log("locking", i);

  const nLayout = layout.map(item => ({ ...item }));

  nLayout.map(item => {
    if (item.i === i) {
      item.static = !item.static;
    }
    return item;
  });
  setLayout(nLayout);
  console.log(layout);
}

const createElement = (el : any) => {
  //console.log(el.size)
  const removeItemStyle = {
    position: "absolute",
    left: "2px",
    top: 0,
    cursor: "pointer",
    fontSize: "20px"
    
  } as React.CSSProperties

  const fixateItemStyle = {
    position: "absolute",
    padding: "5px",
    right: 0,
    top: 0,
    cursor: "pointer",
    fontSize: "15px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "5px",
    
    
  } as React.CSSProperties
  //console.log("called createElement function on ", el);
  const i = el.i;

  const props : any = {width: (1500/12)*(el.w-1), height: 20*(el.h-3)}
  return (
    <div key={i} data-grid={el} >
      
      <ItemBox {...props}  />
      
      {editMode && <span
        style={removeItemStyle}
        onClick={onRemoveItem.bind(this, i)}
      >x</span> }
      
      {editMode && <span
        style={fixateItemStyle}
        onClick={onLockItem.bind(this, i)}
      >Lock</span> }


    </div>
  );
  
}

const handleClearAll = () => {
  setLayout([])
  setNewCounter(0);
  AppToaster.show({ message: "Dashboard cleared", intent: "success" });
}

const handleSaveLayout = () => {
  saveToLS("layout", layout);
  AppToaster.show({ message: "Dashboard saved successfully", intent: "success" });
}

const handleLockAll = () => {
  const nLayout = layout.map(item => ({ ...item }));
  nLayout.map(item => {
    item.static = true;
    return item;
  });
  setLayout(nLayout);
  AppToaster.show({ message: "All components locked", intent: "success" });
}

const handleUnlockAll = () => {
  const nLayout = layout.map(item => ({ ...item }));
  nLayout.map(item => {
    item.static = false;
    return item;
  });
  setLayout(nLayout);
  AppToaster.show({ message: "All components un-locked", intent: "success" });
}

const handleOpenControlPanel = () => {
setIsOpen(!isOpen);
}

const handleChangeEditMode = () => {
  setEditMode(!editMode);
}

const handleChangeSaveMode = () => {
  setSaveMode(!saveMode);

}

const onLayoutChange =(layout : Layout[]) => {
  //console.log("layout change", layout);
  if(saveMode) {
    saveToLS("layout", layout);
  }
  setLayout( layout );
}

function getFromLS(key:any){
  let ls : any = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")!) || {};
      //console.log("ls",ls);
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function getCounterFromLs(){
  let ls : any = 0;
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("dashboard-index")!) || {};
      //console.log("ls",ls);
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls["counter"];
}

function saveToLS(key:any, value:any) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
    global.localStorage.setItem(
      "dashboard-index",
      JSON.stringify({
        counter: newCounter
      })
    );

  }
}

return (
<div>
  {showTooltips &&<ReactTooltip id='editor'>
    <p>Le mode éditeur vous permettra de :</p>
    <ul>
      <li>Supprimer les composants en appuyant sur la croix en haut à gauche</li>
      <li>Vérouiller le composant en appuyant sur lock</li>
      <li>Modifier la taille du composant en cliquant sur l'icone en bas à droite</li>
    </ul>

  </ReactTooltip> }
  {showTooltips && <ReactTooltip />}
  <div className="control-panel">
    <Button className="collapsible" onClick={handleOpenControlPanel}>
      {isOpen && <strong> Cacher panneau de configuration </strong>}
      {!isOpen && <strong> Ouvrir panneau de configuration </strong>}
  
    </Button>
    <H2 className="textCenter"> Panneau de configuration </H2>
    <Collapse isOpen={isOpen} keepChildrenMounted={true}>
    <div className="content">
      <FormGroup  label={"Actions globales"}>
        <Button icon="saved" style={{marginTop : 20}} onClick={handleSaveLayout} intent="success" 
                data-tip="Sauvegarde l'état actuel du dashboard. Attention, si vous avez vidé le dashboard, la sauvegarde rendra cela irréversible">
                Sauvegarder le dashboard 
        </Button> 
        <br/>
        <Button icon="unlock" style={{marginTop : 10}}  onClick={handleUnlockAll} intent="primary"
                data-tip="Déverrouille tous les composants du dashboard.">
                Déverouiller les composants 
        </Button> 
        <br/>
        <Button icon="key" style={{marginTop : 10}}  onClick={handleLockAll} intent="warning"
                data-tip="Vérrouille tous les composants du dashboard. Vous ne pouvez pas déplacer ou changer la taille
                des composants vérouillés.">
                Vérouiller les composants 
        </Button> 
        <br/>
        <Button icon="trash" style={{marginTop : 30}} onClick={handleClearAll} intent="danger"
                data-tip="Supprime tout les composants du dashboard. Attention, si vous avez l'option sauvegarde automatique activée
               l'opération sera irréversible."> 
                Vider le dashboard 
        </Button>
      </FormGroup>
      <FormGroup label={"Usine des composants"}>

        <Button icon="build" style={{marginTop : 20}} onClick={onAddSmallItem} 
                data-tip="Ajoute un composant de petite taille. 
                Parfait pour tous les composants qui ne sont pas des graphiques d'analyse de devises">
                Ajouter un petit composant
        </Button> <br/>
        <Button icon="build" style={{marginTop : 20}} onClick={onAddBigItem}
                data-tip="Ajoute un composant de grande taille. 
                Parfait pour tous les composants graphiques d'analyse sommaire de devises"> 
                Ajouter un grand composant
        </Button> <br/>
        <Button icon="build" style={{marginTop : 20}} onClick={onAddBiggestItem}
                data-tip="Ajoute un composant de très grande taille. 
                Parfait pour tous les composants graphiques d'analyse détaillée de devises">  
                Ajouter un très grand composant
                </Button>
      </FormGroup>

      <FormGroup>
        <Checkbox checked={editMode} onChange={handleChangeEditMode}
                  >
                  <strong data-for="editor" data-tip> Mode éditeur</strong>
        </Checkbox>
        <Checkbox checked={saveMode} onChange={handleChangeSaveMode}>
        <strong data-tip="Cocher cette option vous permet de saubegarder automatiquement le dashboard à chaque modification">
            Sauvegarde automatique
        </strong>
          </Checkbox>
        <BSwitch
          label={compact?"Compactage verticale":"Compactage horizontale"}
          checked={compact}
          onChange={(e) => setCompact(!compact)}
        ></BSwitch>
      </FormGroup>
      
      

    </div>
    </Collapse>


  </div>


 
  <GridLayout className="layout_dashboard" cols={12} rowHeight={12} width={1500} layout={layout} onLayoutChange={onLayoutChange} 
              compactType={compact?"vertical":"horizontal"}>
    {_.map(layout, el => createElement(el))}
  </GridLayout>

</div>

);
};

export default Dashboard;



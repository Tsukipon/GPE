import { H2, H4 } from "@blueprintjs/core";
import '../styles/Dashboard.css';
import { useState } from "react";
import {
    DialogStep,
    MultistepDialog,
} from "@blueprintjs/core";

import Select from 'react-select'
import {CURRENCIES} from "./currencies"   



const CurrencySelection = ({ onChange, selectedValue }) => {
    
    return (
        <div>
            <H4>Selectionnez la paire de devises que vous souhaitez suivre</H4>
            <Select options={CURRENCIES} onChange={onChange}/>
        </div>
        

    )
}

const ConfirmSelection = ({ selectedValue }) => {
    return (
        <div>
            <H2>Vous avez séléctionné la paire :</H2>
            <H4>{selectedValue}</H4>

            <p>
                Pour changer ce choix, cliquez sur le boutton "Retour" ou sur la précedente étape. Sinon, cliquez sur valider pour
                cloturer la selection.
            </p>
        </div>
    )


}



const CurrencySelectionModal = ({ setSelectedCurrency, showCurrencyDialog, handleClose, confirmSelection }) => {
    const [modalSelection, setModalSelection] = useState(null);

    function handleSelectionChange(currency) {
        setModalSelection(currency.value);
    }

    return (

        <div>
            <MultistepDialog
                title={"Currency pair"}
                isOpen={showCurrencyDialog}
                onClose={handleClose}
                canEscapeKeyClose="true"
                canOutsideClickClose="true"
                nextButtonProps={{ disabled: modalSelection === null, text: "Suivant" }}
                finalButtonProps={{ text: "Valider", onClick: () => { confirmSelection(modalSelection); } }}
                backButtonProps={{ text: "Retour" }}
            >
                <DialogStep
                    id="select"
                    panel={<CurrencySelection onChange={handleSelectionChange} selectedValue={modalSelection} />}
                    title="Selection"
                />
                <DialogStep
                    id="confirm"
                    panel={<ConfirmSelection selectedValue={modalSelection} />}
                    title="Confirmation"
                />
            </MultistepDialog>
        </div>
    )
}


export default CurrencySelectionModal;
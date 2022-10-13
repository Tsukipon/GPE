import React, { useState } from "react";
import './resetPassword.css'
import { useDispatch } from "react-redux";
import { askResetPassword } from "../../store/reducers/user.reducer";
import { Button, } from "@blueprintjs/core";

export const AskResetPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(email);

        dispatch(askResetPassword(email))
            .then(request => {
                console.log(request)
                console.log(request.value.request.status);

            }).catch(error => {
                console.log(error);
            })
    }
    return (
        <div className="wrapper">
            <h1>Reset Password Request Form</h1>
            <div className="main">
                <div className="main-top">
                    <form onSubmit={handleSubmit}>
                        <input value={email} onChange={(event) => setEmail(event.target.value)} className="text email" type="email" name="email" placeholder="Email" required={true}></input>
                        <Button text="validate" type="submit" className="submit_btn" />
                    </form>
                    <h5>Please write your e-mail adress to receive a reset password mail</h5>
                </div>

            </div>
            <div className="colorlibcopy-agile">
                <p>© 2021 ForexMetrics. All rights reserved</p>
            </div>
        </div>
    )
}
export default AskResetPassword
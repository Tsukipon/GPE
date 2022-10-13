import React, { useState } from "react";
import './resetPassword.css'
import { useDispatch } from "react-redux";
import { resetPassword } from "../../store/reducers/user.reducer";
import { Button, } from "@blueprintjs/core";

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(newPassword);
        console.log(confirmNewPassword);
        var uuid = window.location.pathname.toString().split("uuid=")[1]
        if (newPassword !== confirmNewPassword) {
            alert("The two password don't match!");
        } else {
            dispatch(resetPassword(newPassword, uuid))
                .then(request => {
                    console.log(request)
                    console.log(request.value.request.status);
                }).catch(error => {
                    console.log(error);
                })
        }
    }
    return (
        <div className="wrapper">
            <h1>Reset Password Form</h1>
            <div className="main">
                <div className="main-top">
                    <form onSubmit={handleSubmit}>
                        <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="text new password" type="password" placeholder="new password" required={true}></input>
                        <input value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} className="text confirm new password" type="password" placeholder="confirm new password" required={true}></input>
                        <Button text="validate" type="submit" className="submit_btn" />

                    </form>
                </div>

            </div>
            <div className="colorlibcopy-agile">
                <p>© 2021 ForexMetrics. All rights reserved</p>
            </div>
        </div>
    )
}
export default ResetPassword
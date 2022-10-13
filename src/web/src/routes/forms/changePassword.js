import React, { useState } from "react";
import './changePassword.css'
import { useDispatch } from "react-redux";
import { Button, } from "@blueprintjs/core";
import { changePassword } from "../../store/reducers/user.reducer";

export const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(oldPassword);
        console.log(newPassword);
        console.log(confirmNewPassword);

        if (newPassword !== confirmNewPassword) {
            alert("The two password don't match!");
        } else if (newPassword === oldPassword) {
            alert("The new password must be different from the old one");
        }
        else {
            dispatch(changePassword(oldPassword, newPassword))
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
            <h1>Change Password Form</h1>
            <div className="main">
                <div className="main-top">
                    <form onSubmit={handleSubmit}>
                        <input value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} className="text old password" type="password" placeholder="old password" required="true"></input>
                        <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="text new password" type="password" placeholder="new password" required="true"></input>
                        <input value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} className="text confirm new password" type="password" placeholder="confirm new password"></input>
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
export default ChangePassword
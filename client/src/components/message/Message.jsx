import "./message.css"
import {format} from "timeago.js"

export default function Message({message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messagetop">
                <img src="assets/ad.png" alt="" className="messageimg" />
                <p className="messagetext">
                    {message.text}
                </p>
            </div>
            <div className="messagebottom">
                {format(message.createdAt)}
            </div>

        </div>
    )
}

import "./chatonline.css"
import axios from "axios"
import { useEffect, useState } from "react";

export default function Chatonline({ onlineusers, currentId, setCurrentchat }) {


    const [friends, setFriends] = useState([]);
    const [onlinefriends, setOnlinefriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            setFriends(res.data);
        };
        getFriends();
    }, [currentId]);


    useEffect(() => {
        setOnlinefriends(friends.filter((f) => onlineusers.includes(f._id)));
    }, [friends, onlineusers]);



    const handleClick = async (user) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
            setCurrentchat(res.data);

        } catch (err) {
            console.log(err)
        }

    }


    return (
        <div className="chatonline">
            {onlinefriends.map((o) => (
                <div className="chatonlinefriend" onClick={() => handleClick(o)}>
                    <div className="chatonlineimgcontainer">
                        <img src={o?.profilePicture ? PF + o.profilePicture : PF + "person/noAvatar.png"} alt=" " className="chatonlineimg" />
                        <div className="chatonlinebadge"></div>
                    </div>
                    <span className="chatonlinename">{o.username}</span>

                </div>

            ))}


        </div>
    )
}

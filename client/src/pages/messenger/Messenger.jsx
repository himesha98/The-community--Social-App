import { useContext, useEffect, useRef, useState } from "react"
import Chatonline from "../../components/chatonline/Chatonline"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import Topbar from "../../components/topbar/Topbar"
import { AuthContext } from "../../context/AuthContext"
import "./messenger.css"
import axios from "axios";
import { io } from "socket.io-client"






export default function Messenger() {

    const [conversations, setConversations] = useState([]);
    const [currentchat, setCurrentchat] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newmessage, setNewmessage] = useState("");
    const [arrivalmessage, setArrivalmessage] = useState(null);
    const socket = useRef(io("ws://localhost:8900"));
    const { user } = useContext(AuthContext);
    const [onlineusers, setOnlineusers]  =useState([])
    const scrollRef = useRef();



    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            setArrivalmessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),

            });

        })
    }, []);


    useEffect(() => {
        arrivalmessage && currentchat?.members.includes(arrivalmessage.sender) && 
        setMessages((prev) => [...prev,arrivalmessage]);
    }, [arrivalmessage,currentchat]);


    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            setOnlineusers(user.followings.filter((f) => users.some((u) => u.userId === f)));
        })
    }, [user])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {

        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentchat?._id);
                setMessages(res.data);
            } catch (err) {

            }
        };
        getMessages();


    }, [currentchat]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newmessage,
            conversationId: currentchat._id,
        };

        const receiverId = currentchat.members.find(member => member !== user._id)

        socket.current.emit("sendmessage", {
            senderId: user._id,
            receiverId,
            text: newmessage,
        })


        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewmessage("");
        } catch (err) {
            console.log(err);

        }
    }



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })

    }, [messages])



    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatmenu">
                    <div className="chatmenuwrapper">
                        <input type="text" placeholder="Search for Friends" className="chatmenuinput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentchat(c)} >
                                <Conversation
                                    conversation={c}
                                    currentUser={user} />
                            </div>
                        ))}



                    </div>
                </div>
                <div className="chatbox">
                    <div className="chatboxwrapper">
                        {currentchat ? (<> <div className="chatboxtop">
                            {messages.map((m) => (
                                <div ref={scrollRef} >
                                    <Message message={m}
                                        own={m.sender === user._id} /> </div>
                            ))}

                        </div>
                            <div className="chatboxbottom">
                                <textarea name="" id="" onChange={(e) => setNewmessage(e.target.value)} value={newmessage} className="chatmessageinput" placeholder="Write Something"></textarea>
                                <button className="chatsubmitbutton" onClick={handleSubmit} type="submit">Send</button>

                            </div></>) : (<span className="noconversationtext" >open a conversation</span>)}

                    </div>
                </div>
                <div className="chatonline">
                    <div className="chatonlinewrapper">
                        <Chatonline
                        onlineusers = {onlineusers}
                        currentId = {user._id }
                        setCurrentchat={setCurrentchat}/>

                    </div>
                </div>


            </div>
        </>
    )
}

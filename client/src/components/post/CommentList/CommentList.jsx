import './commentlist.css'
import Comment from "./Comment"

export default function CommentList(props) {
    return (
        <div>
          {props.comments.map((c)=>(
            <Comment key={c.id} comment={c} />
          ))}  
           
        </div>
        
    );
    
}

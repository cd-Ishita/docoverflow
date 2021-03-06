import ClickOutHandler from 'react-clickout-handler';
import {useState,useContext} from 'react';
import {Redirect} from 'react-router-dom';
import Input from "./Input";
import Textarea from "./Textarea";
import Button from "./Button";
import PostFormModalContext from "./PostFormModalContext";
import AuthModalContext from "./AuthModalContext";
import axios from "axios";

function PostFormModal () {

  const modalContext = useContext(PostFormModalContext);
  const authModalContext = useContext(AuthModalContext);

  //visibility of the modal
  const visibleClass = modalContext.show ? 'block' : 'hidden';

  const [title,setTitle] = useState('');
  const [body,setBody] = useState('');
  const [newPostId, setNewPostId] = useState(null);

  //posts the new query data to the backend to be stored in the database
  function createPost() {
    const data = {title,body};
    axios.post('http://localhost:4000/comments', data, {withCredentials:true})
      .then(response => {
        setNewPostId(response.data._id);
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 401) {
          authModalContext.setShow('login');
        }
      });
  }

  // If posting is successful, it will redirect to the new post page 
  if (newPostId) {
    return (<Redirect to={'/comments/'+newPostId} />);
  }

  return (

    //Create a new query module
    <div
      className={"w-screen h-screen fixed top-0 left-0 z-20 flex "+visibleClass}  style={{backgroundColor:'rgba(0,0,0,.8)'}}>
      
      {/*Checks what element has been clicked and its properties */}
      <ClickOutHandler onClickOut={() => {}  }>
        <div className="border border-docflow_dark-brightest w-3/4 md:w-2/4 bg-docflow_dark p-5 text-docflow_text self-center mx-auto rounded-md">
          <h1 className="text-2xl mb-5">Create a new query</h1>
          
          {/* Title of the query */}
          <Input
            className={'w-full mb-3'}
            placeholder={'Title'}
            onChange={e => setTitle(e.target.value)}
            value={title} />

            {/* Content of the query */}
          <Textarea
            className={'w-full mb-3'}
            placeholder={'Post text (you can use markdown)'}
            onChange={e => setBody(e.target.value)}
            value={body} />
          <div className={'text-right'}>
            <Button onClick={() => modalContext.setShow(false)}
                    outline className={'px-4 py-2 mr-3'}>Cancel</Button>
            <Button onClick={() => createPost()} className={'px-4 py-2'}>POST</Button>
          </div>
        </div>
      </ClickOutHandler>
    </div>
  );
}

export default PostFormModal;
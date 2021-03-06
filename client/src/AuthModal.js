import Input from "./Input";
import Button from "./Button";
import {useState,useContext} from 'react';
import axios from 'axios';
import AuthModalContext from "./AuthModalContext";
import ClickOutHandler from 'react-clickout-handler';
import UserContext from "./UserContext";

function AuthModal() {
  const [modalType,setModalType] = useState('login');
  const [email,setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const modalContext = useContext(AuthModalContext);
  const user = useContext(UserContext);

  //just to control visibility of modals in different contexts
  const visibleClass = modalContext.show ? 'block' : 'hidden';
  if (modalContext.show && modalContext.show !== modalType) {
    setModalType(modalContext.show);
  }

  function register(e) {
    e.preventDefault();
    //the data taken from the input fields is posted to the backend using axios
    const data = {email,username,password};
    axios.post('http://localhost:4000/register', data, {withCredentials:true})
      .then(() => {
        user.setUser({username});
        modalContext.setShow(false);
        setEmail('');
        setPassword('');
        setUsername('');
      });
  }

  function login() {
    const data = {username,password};
    //the data is posted to backend for authentication of user, if credentials turn out to be true, modal diappears and user has access to everything
    axios.post('http://localhost:4000/login', data, {withCredentials:true})
	  .then(() => {
	    modalContext.setShow(false);
	    user.setUser({username})
	  });
  }

  return (
    <div className={"w-screen h-screen fixed top-0 left-0 z-30 flex "+visibleClass} style={{backgroundColor:'rgba(0,0,0,.6)'}}>
      {/* click out handler basically checks if you have clicked inside an element or outside 
      if you click outside, modal will not be shown
      otherwise, the modal will be visible to you */}
      <ClickOutHandler onClickOut={() => modalContext.setShow(false)}>
        <div className="border border-docflow_dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-docflow_dark p-5 text-docflow_text self-center mx-auto rounded-md">
          
          {/* All the code in flower brackets is in Javascript and becomes specific to the component named */}
          {/* The code in tags is common and applies to all the components */}

          {/* We are defining that there are 2 kinds of Modals - LogIn and Register */}
          {modalType === 'login' && (
            <h1 className="text-2xl mb-5">Login</h1>
          )}
          {modalType === 'register' && (
            <h1 className="text-2xl mb-5">Sign Up</h1>
          )}

          {/* Here we define what fields are specific to the register modal */}
          {modalType === 'register' && (
            <label>
              <span className="text-docflow_text-darker text-sm">E-mail:</span>
              <Input type="email" className="mb-3 w-full" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
          )}

          {/* Since this part is inside a label tag, all the fields here apply to all the defined modals */}
          <label>
            <span className="text-docflow_text-darker text-sm">Username:</span>
            <Input type="text" className="mb-3 w-full" value={username} onChange={e => setUsername(e.target.value)} />
          </label>

          <label>
            <span className="text-docflow_text-darker text-sm">Password:</span>
            <Input type="password" className="mb-3 w-full" value={password} onChange={e => setPassword(e.target.value)} />
          </label>

          {/* Specific to login modal, clicking on the button activates the login function*/}
          {modalType === 'login' && (
            <Button className="w-full py-2 mb-3" style={{borderRadius:'.3rem'}} onClick={()=>login()}>
              Log In
            </Button>
          )}

          {/* Specific to register modal, clicking on the button activates the register function */}
          {modalType === 'register' && (
            <Button className="w-full py-2 mb-3" style={{borderRadius:'.3rem'}} onClick={e => register(e)}>
              Sign Up
            </Button>
          )}


          {modalType === 'login' && (
            //Clicking on the button "New to DocOverFlow?" redirects you to register modal
            <div>
              New to DocOverFlow? <button className="text-blue-600" onClick={() => modalContext.setShow('register')}>SIGN UP</button>
            </div>
          )}
          {modalType === 'register' && (
            //Clicking on the "Already have an account?" button redirects you to login modal
            <div>
              Already have an account? <button className="text-blue-600" onClick={() => modalContext.setShow('login')}>LOG IN</button>
            </div>
          )}
        </div>
      </ClickOutHandler>
    </div>
  );
}

export default AuthModal;

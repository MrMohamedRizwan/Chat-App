import logo from './logo.svg';
import './App.css';
import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';

function  App() {
  return (
    <>
    <div className='App'>
    <Route path='/' component={HomePage} exact/>
    <Route path='/chats' component={ChatPage} exact/>
    
    {/* <Button colorScheme='blue'>Button</Button>
    <h1>Rizwan</h1> */}
    </div>
    </>
  );
}

export default App;
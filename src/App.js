
import HomeScreen from './components/HomeScreen';
import AboutScreen from './components/AboutScreen';
import React from 'react';

import { MyContextProvider} from './Global'
import {Sidebar} from './components/Sidebar.js';
import "./App.css";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import CalendarScreen from './components/CalendarScreen';

function App (){   
  const [isOpen, setIsOpen] = React.useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    return (
      <MyContextProvider>
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='left'
                className='bla bla bla'
            >
                <Sidebar />
            </Drawer>
            <BrowserRouter>
              <Routes>
                <Route path="/"  element={<HomeScreen toggleDrawer={toggleDrawer}/>} />
                {/* <Route path="/"  element={<CalendarScreen toggleDrawer={toggleDrawer}/>} /> */}
              </Routes>
            </BrowserRouter>
           
      </MyContextProvider>

    );
};




export default App;
import React from "react";

const MyContext = React.createContext({});

const MyContextProvider = ({children}) => {
    const [userID, setUserID] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [profileURL, setprofileURL] = React.useState('');
    const [tokenInfo, setTokenInfo] = React.useState({});
    const [taskInfo, setTaskInfo] = React.useState({});
    const [accThreshold, setAccThreshold] = React.useState({
        "Nback": 20,
        "Stroop": 60,
        "Fluid":20,
    });
    const [timeLimits, setTimeLimits] = React.useState({
        "Nback": 8,
        "Stroop": 20,
        "Fluid":20,
    });
    return (
        <MyContext.Provider value = {{
            userID, setUserID, userName, setUserName, profileURL, setprofileURL,
            tokenInfo, setTokenInfo, taskInfo, setTaskInfo,
            accThreshold, setAccThreshold,timeLimits,setTimeLimits
        }}>
            {children}
        </MyContext.Provider>
    );
}

export {MyContext, MyContextProvider};
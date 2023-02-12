import React, { Component } from 'react';
import { config as fitbit_config } from './Fitbit-config';
import { Api } from 'fitbit-api-handler';
import { Button,Image } from 'react-native-web';
import { MyContext } from '../Global';
import {fitbitHelper} from './fitbitHelper';
import { writeUserData, loadDataByUserID } from './Firebase-config';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import {Calendar} from 'react-native-calendars';


class HomeScreen extends Component{
    static contextType = MyContext;
    
    FetchProfile = async () => {
        const { setUserID, setUserName, setprofileURL, tokenInfo, setTaskInfo } = this.context;
        //console.log(tokenInfo.accessToken);
        if(!tokenInfo || !tokenInfo.accessToken)return;
       
        var response = fitbitHelper.GetProfileInfo(tokenInfo.accessToken).then(response => {
          if (response.user) {
            setUserID(response.user["encodedId"]);
            setprofileURL(response.user["avatar640"]);
            console.log(response);
            const user_info = tokenInfo;
            user_info["user_id"] = response.user["encodedId"];
            user_info["user_profile"] = response.user["avatar640"];
            //AsyncStorage.setItem("token_info", JSON.stringify(user_info));
            // loadDataByUserID(response.user["encodedId"]).then((userData) => {
            //   if (userData.length >= 1) {
            //     const d = userData[0];
            //     console.log("登録済みのユーザ:", d.name);
            //     setUserName(d.name);
            //     setTaskInfo({
            //       "NbackDuration": d.NbackDuration,
            //       "NbackAccuracy": d.NbackAccuracy,
            //       "NbackRound": d.NbackRound,
            //       "StroopDuration": d.StroopDuration,
            //       "StroopAccuracy": d.StroopAccuracy,
            //       "StroopRound": d.StroopRound,
            //       "FluidDuration": d.FluidDuration,
            //       "FluidAccuracy": d.FluidAccuracy,
            //       "FluidRound": d.FluidRound,
            //       "StartDate": d.ExpStartDate,
            //       "EndDate":d.ExpEndDate
            //     });
            //   }
            //   else {
            //     console.log("未登録のユーザ:", response.user["displayName"]);
            //     setUserName(response.user["displayName"]);
            //     const today_date = new Date(Date.now());
            //     const today_str = today_date.toISOString().split('T')[0]
            //     writeUserData({
            //       ID: response.user["encodedId"],
            //       profile: response.user["avatar640"],
            //       name: response.user["displayName"],
            //       ExpStartDate: today_str,
            //       ExpEndDate: '',
            //       totalDuration: 0,
            //       NbackDuration: 0,
            //       StroopDuration: 0,
            //       FluidDuration: 0,
            //       NbackRound: 0,
            //       StroopRound: 0,
            //       FluidRound: 0,
            //       NbackAccuracy: 0,
            //       StroopAccuracy: 0,
            //       FluidAccuracy: 0,
                  
            //     });
            //     setTaskInfo({
            //       "NbackDuration": 0,
            //       "NbackAccuracy": 0,
            //       "NbackRound": 0,
            //       "StroopDuration": 0,
            //       "StroopAccuracy": 0,
            //       "StroopRound": 0,
            //       "FluidDuration": 0,
            //       "FluidAccuracy": 0,
            //       "FluidRound": 0,
            //       "StartDate": today_str,
            //       "EndDate":''
            //     });
    
            //   }
            // }).catch(error => {
            //   console.log("Failed to get data by ID (firebase) ", error);
            // });
          }
          else {
            console.log("Failed to get profile (fitbit)",response);
          }
        }).catch((err) => {
          console.log("Failed to get profile (fitbit)", err);
        });
       
    }

    componentDidMount(){
        const {setTokenInfo, tokenInfo} = this.context;
        if(tokenInfo.accessToken)return;
        const queryParameters = new URLSearchParams(window.location.search)
        const code = queryParameters.get("code");
        if(tokenInfo.accessToken) return;
        //TODO:
        // 查看cacheのtoken Info
        // 如果有，查看有没有过期
        // 如果过期，则reset tokenInfo
        // 如果没有过期，则使用已有的tokenInfo
        if(code){
          const api = new Api(fitbit_config.clientId,fitbit_config.clientSecret);
          api.requestAccessToken(code, fitbit_config.redirectUrl).then((res)=>{
            api.setAccessToken(res.access_token); 
            setTokenInfo({
                accessToken: res.access_token,
                accessTokenExpirationDate: res.expireDate,
                refreshToken: res.refresh_token,
              })
            this.FetchProfile(); 
          });
        }
      }
    
      my_authorize = async ()=>{
          const api = new Api(fitbit_config.clientId,fitbit_config.clientSecret);
          const url = api.getLoginUrl(fitbit_config.redirectUrl, fitbit_config.scopes);
          window.location.replace(url);
      };
    
    render(){
        const {tokenInfo} = this.context;
        return (
        <div >
            <Button title="Log in with Fitbit Account" onPress={this.my_authorize}></Button>
            <p></p>
            <Button title="open drawer" onPress={this.props.toggleDrawer}></Button>
            <p></p>
           
            <p>{tokenInfo.accessToken}</p>
            <div>
              <Calendar />
            </div>
        </div>
        );
    }


}
export default HomeScreen;
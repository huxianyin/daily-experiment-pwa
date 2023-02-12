const fitbit_api_url = "https://api.fitbit.com/1/user/-/";
const fitbit_api_url_for_sleep = "https://api.fitbit.com/1.2/user/-/";

const GetTodayDateStr = () => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime.split('T')[0];
}

const fetchFitbitData = async(fetch_url, accessToken) => {
    if (!accessToken) return null
    try {
        const res = fetch(fetch_url, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }),
            }).then(response => {
                return response.json();
            }).then(response => {
                return response;
            })
            .catch(error => {
                console.error(error);
            });
        return res;
    } catch (error) {
        //Alert.alert('Failed to get fitbit dataa', error.message);
        console.log('Failed to get fitbit dataa', error.message);
        return null;
    }
};

export const fitbitHelper = {

    GetTodayHR: (token) => {
        const url = fitbit_api_url + "activities/heart/date/" + GetTodayDateStr() + "/1d/1sec/time/00:00/23:59.json";
        //console.log(url);
        return fetchFitbitData(url, token);
    },
    ///////////////////////////////////////////// ACTIVITY  /////////////////////////////////////////////

    ////////////// /* details of a specific day */ //////////////
    GetActivityCaloriesDetail: (date, token) => {
        const url = fitbit_api_url + "activities/calories/date/" + date + "/1d/1min/time/00:00/23:59.json";
        return fetchFitbitData(url, token);
    },
    GetActivityStepsDetail: (date, token) => {
        const url = fitbit_api_url + "activities/steps/date/" + date + "/1d/1min/time/00:00/23:59.json";
        return fetchFitbitData(url, token);
    },
    GetActivityAZMDetail: (date, token) => {
        const url = fitbit_api_url + "activities/active-zone-minutes/date/" + date + "/1d/1min/time/00:00/23:59.json";
        return fetchFitbitData(url, token);
    },
    ////////////// /* summary */ //////////////
    GetActivityCaloriesSummary: (start_date, end_date, token) => {
        const url = fitbit_api_url + "activities/calories/date/" + start_date + "/" + end_date + ".json";
        return fetchFitbitData(url, token);
    },
    GetActivityStepsSummary: (start_date, end_date, token) => {
        const url = fitbit_api_url + "activities/steps/date/" + start_date + "/" + end_date + ".json";
        return fetchFitbitData(url, token);
    },
    GetActivityAZMSummary: (start_date, end_date, token) => {
        const url = fitbit_api_url + "activities/active-zone-minutes/date/" + start_date + "/" + end_date + ".json";
        return fetchFitbitData(url, token);
    },

    ///////////////////////////////////////////// HEART RATE /////////////////////////////////////////////
    GetHeartRateDetail: (date, token) => {
        const url = fitbit_api_url + "activities/heart/date/" + date + "/1d/1sec/time/00:00/23:59.json";
        return fetchFitbitData(url, token);
    },
    GetHeartRateSummary: (start_date, end_date, token) => {
        const url = fitbit_api_url + "activities/heart/date/" + start_date + "/" + end_date + ".json";
        return fetchFitbitData(url, token);
    },


    /////////////////////////////////////////////  INFO OF SLEEP /////////////////////////////////////////////
    GetBreathRateDetail: (date, token) => {
        const url = fitbit_api_url + "br/date/" + date + "/all.json";
        return fetchFitbitData(url, token);
    },

    GetHeartRateVariabilityDetail: (date, token) => {
        const url = fitbit_api_url + "hrv/date/" + date + "/all.json";
        return fetchFitbitData(url, token);
    },

    GetSleepScoreDetail: (date, token) => {
        const url = fitbit_api_url_for_sleep + "sleep/date/" + date + ".json";
        return fetchFitbitData(url, token);
    },


    ///////////////////////////////////////////// other funcs /////////////////////////////////////////////
    calc_timeDiff: (t) => {
        const now = new Date();
        let date = now.getDate();
        let month = now.getMonth() + 1;
        if (month < 10) month = "0" + month.toString();
        if (date < 10) date = "0" + date.toString();
        let year = now.getFullYear();
        let datetime = year + "-" + month + "-" + date;
        var arrivalTime = datetime + "T" + t + "+09:00";
        var parsed_t = new Date(arrivalTime);
        //console.log(t,parsed_t);
        const min_diff = (now - parsed_t) / 60000;
        return min_diff;
    },
    GetDateStr: (timestamp) => {
        var tzoffset = (new Date(timestamp)).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(timestamp - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.split('T')[0];
    },

    GetProfileInfo: (token) => {
        const url = "https://api.fitbit.com/1/user/-/profile.json";
        return fetchFitbitData(url, token);
    }
}

//export default fitbitHelper;
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCVHc6ajfKdXLbG-LNkAyyABCSAm9KOkgI",
    authDomain: "dailyhumanperformanceexp.firebaseapp.com",
    projectId: "dailyhumanperformanceexp",
    storageBucket: "dailyhumanperformanceexp.appspot.com",
    messagingSenderId: "477203275799",
    appId: "1:477203275799:web:652fb4f06cdde0c1b1bc52",
    measurementId: "G-9XV178V9TY",
    databaseURL: "https://dailyhumanperformanceexp.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore()
const user_collection = "users";
const daily_collection = "DailySummary";
const fitbit_collection = "Fitbit";

db.settings({
    experimentalForceLongPolling: true, // this line
    useFetchStreams: false, // and this line
    merge: true,
});


//************************** low level funcs **************************//

const writeData = (docRef, data) => {
    return docRef.set(data)
        .then(() => {
            //console.log("Document successfully written!", data);
            return true
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            return false;
        });
}

const loadAllData = async(colleciton_name) => {
    const userDoc = await db.collection(colleciton_name).get()
        .then(querySnapshot => {
            var data = [];
            querySnapshot.forEach(docSnap => {
                if (docSnap.exists) {
                    var item = docSnap.data();
                    item.doc_id = docSnap.id;
                    data.push(item);
                }
            });
            return data;

        })
        .catch((err) => {
            console.log(err);
        });
    return userDoc;
}





//************************** high level funcs **************************//
const loadDataByUserID = async(userID) => {
    const userDoc = await db.collection(user_collection).doc(userID).get().then(doc => {
        var data = [];
        if (doc.exists) {
            var item = doc.data();
            item.doc_id = doc.id;
            data.push(item);
        }
        return data;
    });
    return userDoc;
}


const loadAllUserData = async() => {
    return await loadAllData(user_collection);
}

const writeFitbitSummaryData = async (user_id,data) => {
    const docRef = db.collection(user_collection).doc(user_id).collection(fitbit_collection).doc("Summary");
    const success = await writeData(docRef, data);
    return success;
}

const writeFitbitDetailData = async (user_id,key,data) => {
    const docRef = db.collection(user_collection).doc(user_id).collection(fitbit_collection)
        .doc("Detail").collection(data["date"]).doc(key);
    const success = await writeData(docRef, data);
    return success;
}



const writeUserData = async(data) => {
    if (data.name == null || data.profile == null || data.ID == null || data.totalDuration == null) {
        alert("not valid data structure");
        return;
    }
    const docRef = db.collection(user_collection).doc(data.ID);
    writeData(docRef, data);
}

const writeResultData = async(userID, task_name, round_id, data) => {
    const doc_id = "trial" + data.trial.toString() + "_rsp" + data.respondN.toString();
    const docRef = db.collection(user_collection).doc(userID).collection(task_name)
        .doc("Round_" + round_id).collection("task_data")
        .doc(doc_id);
    writeData(docRef, data);
}

const writeAnquetData = async(userID, task_name, round_id, data) => {
    //console.log("write anquet data");
    //console.log(data);
    const docRef = db.collection(user_collection).doc(userID).collection(task_name)
        .doc("Round_" + round_id);
    writeData(docRef, { "Anquet": data });
}

const updateUserData = async(userID, task_name, accuracy, plus_time, threshold) => {
    //console.log("Updating.... " + doc_id);
    //console.log(data);
    const tmp_data = await getUserData(userID);
    const data = tmp_data.data;
    const month_data = tmp_data.month_data;
    var tmp = get_daily_doc_id_and_key_for_today();
    const today_str = tmp["key"]
    const month_str = tmp["doc_id"]
    const today_data = month_data[today_str]


    ////////////////////////////update summary data////////////////////////////////////
    const round = data[task_name + "Round"];
    const duration = data[task_name + "Duration"];
    var old_accuracy = data[task_name + "Accuracy"]
    const totalDuration = data["totalDuration"];
    //計算新しい正解率（全期間）
    var new_accuracy = 0;
    if (accuracy < threshold) {
        new_accuracy = old_accuracy; //無効の場合はno count
    } else {
        if (round == 0) {
            new_accuracy = accuracy; //最初の一回の場合は 上書き
        } else {
            new_accuracy = (old_accuracy + accuracy) / 2; //平均をとる
        }
    }
    var update_data = {}
    switch (task_name) {
        case "Nback":
            update_data = { "NbackRound": round + 1, "NbackDuration": duration + plus_time, "totalDuration": totalDuration + plus_time, "NbackAccuracy": new_accuracy };
            break;
        case "Stroop":
            update_data = { "StroopRound": round + 1, "StroopDuration": duration + plus_time, "totalDuration": totalDuration + plus_time, "StroopAccuracy": new_accuracy };
            break;
        case "Fluid":
            update_data = { "FluidRound": round + 1, "FluidDuration": duration + plus_time, "totalDuration": totalDuration + plus_time, "FluidAccuracy": new_accuracy };
            break;
        default:
            console.log("No such task:", task_name);
            break;
    }
    db.collection(user_collection).doc(userID).update(update_data).then(function() {
        //console.log(userID + " updated!!");
    });



    ////////////////////////////update daily summary data////////////////////////////////////
    try {
        if (today_data) {
            var update_daily_data = today_data;
            old_accuracy = today_data["Acc_" + task_name];
            //計算新しい正解率（本日）
            var new_accuracy = 0;
            var add_round = 0;
            if (accuracy < threshold) {
                new_accuracy = old_accuracy; //無効の場合はno count
            } else {
                if (today_data["N_" + task_name] == 0) {
                    new_accuracy = accuracy; //最初の一回の場合は 上書き
                } else {
                    new_accuracy = (old_accuracy + accuracy) / 2; //平均をとる
                }
                add_round = 1;
            }
            update_daily_data["Acc_" + task_name] = new_accuracy;
            update_daily_data["N_" + task_name] = today_data["N_" + task_name] + add_round;
            month_data[today_str] = update_daily_data
            console.log(month_data);
        }
        else {
            month_data[today_str] = {
                "Acc_Fluid": 100, "Acc_Nback": 100, "Acc_Stroop": 100,"N_Fluid":0,"N_Stroop":0,"N_Nback":0,
            };
            month_data[today_str]["N_" + task_name] = 1;
            month_data[today_str]["Acc_" + task_name] = accuracy;

        }
        db.collection(user_collection).doc(userID).collection(daily_collection).doc(month_str).
                update(month_data).then(function () {
                    //console.log(userID + " updated!!");
                });
    } catch (err) {
        console.log(err,today_data);
    }



}

const updateUserName = async(userID, updateName) => {
    db.collection(user_collection).doc(userID).update({ name: updateName }).then(function() {
        console.log(" updated name --> " + updateName);
    });
}

const get_daily_doc_id_and_key_for_today = () => {
    const today_date = new Date(Date.now());
    const m_prefix = today_date.getMonth() < 10 ? "0" : "";
    const d_prefix = today_date.getDate() < 10 ? "0" : "";

    const this_month_str = today_date.getFullYear().toString() + "-" + m_prefix + (today_date.getMonth() + 1).toString();
    const today_str = this_month_str + "-" + d_prefix + today_date.getDate().toString();
    console.log(this_month_str, today_str);

    return { "doc_id": this_month_str, "key": today_str };
}


const getTaskRoundNum = async(userID, task_name) => {
    var round_num = 0;
    var accuracy = 0;
    await db.collection(user_collection).doc(userID).get()
        .then(querySnapshot => {
            const data = querySnapshot.data();
            console.log(task_name, data)
            round_num = data[task_name + "Round"];
            accuracy = data[task_name + "Accuracy"]
                //console.log("round=",round_num);
        })
        .catch((err) => {
            console.log(err);
        });
    return { "Round": round_num, "Accuracy": accuracy };
}

const getUserData = async(userID) => {
    const data = await db.collection(user_collection).doc(userID).get()
        .then(querySnapshot => {
            return querySnapshot.data();
        })
        .catch((err) => {
            console.log(err);
        });
    var tmp = get_daily_doc_id_and_key_for_today();
    var todayRef = db.collection(user_collection).doc(userID).collection(daily_collection).doc(tmp["doc_id"]);
    var todayDoc = await todayRef.get();
    if (!todayDoc.exists) {
        //console.log('No such document!');
        var month_data = {}
        month_data[tmp.key] = { "N_Nback": 0, "N_Stroop": 0, "N_Fluid": 0, "Acc_Nback": 0, "Acc_Stroop": 0, "Acc_Fluid": 0 };
        writeData(todayRef, month_data);
    } else {
        month_data = todayDoc.data();
        //month_data[tmp.key] = { "N_Nback": 0, "N_Stroop": 0, "N_Fluid": 0, "Acc_Nback": 0, "Acc_Stroop": 0, "Acc_Fluid": 0 };
        if (!tmp.key in month_data) {
            month_data[tmp.key] = { "N_Nback": 0, "N_Stroop": 0, "N_Fluid": 0, "Acc_Nback": 0, "Acc_Stroop": 0, "Acc_Fluid": 0 };
        }
        // else {
        //     month_data[tmp.key] 
        // }
    }
    return { data: data, month_data: month_data };
}

const getDailyData = async(userID, doc_id) => {
    var monthRef = db.collection(user_collection).doc(userID).collection(daily_collection).doc(doc_id);
    var monthDoc = await monthRef.get();
    var  data= {};
    if (monthDoc.exists) {
      data = monthDoc.data();
    }
    return data;
}

export {
    db, writeUserData, writeResultData, writeAnquetData,
    loadAllUserData, loadDataByUserID,
    updateUserData, updateUserName, getTaskRoundNum, getDailyData,
    writeFitbitSummaryData,writeFitbitDetailData,
}
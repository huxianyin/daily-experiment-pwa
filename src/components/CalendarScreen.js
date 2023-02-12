import React,{useContext, useState, useEffect} from "react";
import { Image,Text, View, StyleSheet, Pressable } from "react-native-web"
import { MyContext } from "../Global";
import {BlankScreen} from "./BlankScreen"
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import {MyBarChart} from "./MyBarChart";
import { getDailyData } from "./Firebase-config";

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul.', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dayNames: ['日','月', '火', '水', '木', '金', '土'],
  dayNamesShort:  ['日', '火', '火', '水', '木', '金', '土'],
};
LocaleConfig.defaultLocale = 'fr';

const customStyles_list = [
    {// level1 style
        container: {
            backgroundColor: 'green'
        },
        text: {
            color: 'black',
            fontWeight: 'bold'
        }
    },// level2 style
    {
        container: {
            backgroundColor: 'red'
        },
        text: {
            color: 'white',
            fontWeight: 'bold'
        }
        
    },// level3 style
    {
        container: {
            backgroundColor: 'blue'
        },
        text: {
            color: 'green',
            fontWeight: 'bold'
        }
        
    }
    
]

const styles = StyleSheet.create({
    detailContainer: {
        width:"100%",
        backgroundColor: "#DFEAE2",
        height: "100%",
    },
    detail: {
        height: 150,
        justifyContent: "space-between",
        alignSelf:"center",
        flexDirection: "row",
        marginVertical: 10,
        paddingHorizontal:0,
    },
    detail_element: {
        marginHorizontal: 25,
        alignItems: "center",
        alignSelf:"flex-start",
    },
    detailTitle: {
        fontSize: 20,
        alignSelf: "center",
        marginTop: 10,
        textDecorationColor: "yellow",
        textDecorationStyle: "double",
        textDecorationLine:"underline",
    },
    icon: {
        width: 60,
        height: 60,
        borderColor: "#8DC3A7",
        borderWidth: 3,
        borderRadius: 60,
    },
    detail_text: {
        fontSize: 14,
    },
    summary_title: {
        fontSize: 18,
        marginHorizontal: 10,
        marginVertical:1,
    },
    date_style: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: 35,
        borderRadius: 100,
    },
    today_style: {
        backgroundColor: "#DFEAE2",
    },
    stamp_style: {
        resizeMode: "contain",
        width: 40,
        height:40,
        position: "absolute"
    }

})
const days = ["日", "月", "火", "水", "木", "金", "土"];
  
export const CalendarScreen = ({ navigation }) => {
    const { userID, timeLimits} = useContext(MyContext);
    const mark_dates = (mdata) => {
        var tmp = {}
        for (const [key, value] of Object.entries(mdata)) {
            var item = {}
            item = { marked: true };
            var level = 0;
            if (value.N_Nback >= 1) level += 1;
            if (value.N_Stroop >= 1) level += 1;
            if (value.N_Fluid >= 1) level += 1;
            item["level"] = level;
            tmp[key] = item;
          }
        return tmp
    }

    const timestamp2showStr = (t) => {
        //console.log(t);
        const date = new Date(t);
        const string =
            (date.getMonth()+1) + "/" + date.getDate() + "\n(" + days[date.getDay()] + ")";
        return string;
    };

    const timestamp2searchStr = (t) => {
        const d = new Date(t);
        const m_prefix = d.getMonth() + 1 < 10 ? "0" : "";
        const d_prefix = d.getDate() < 10 ? "0" : "";
        //console.log(d);
        const string = d.getFullYear().toString() + "-" + m_prefix +(d.getMonth()+1).toString() + "-" + d_prefix +d.getDate().toString();
        //console.log(string);
        return string;
    };

    const get_this_week = () => {
        const date = new Date(Date.now());
        const weekday = date.getDay();
        var this_weeks = [];
        var start_of_this_week = Date.now() - weekday * 24 * 1000 * 3600;
            for (var i = 0; i < 7; i++) {
                const t = start_of_this_week + i * 24 * 1000 * 3600;
                this_weeks.push(
                    timestamp2searchStr(t)
            );
            }
        return this_weeks;
    };
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState(false);
    const [day, setDay] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const [nbackNum, setNbackNum] = useState(0);
    const [stroopNum, setStroopNum] = useState(0);
    const [fluidNum, setFluidNum] = useState(0);
    
    const [monthData, setMonthData] = useState({});
    const [markList, setMarkList] = useState({});
    const [barChartData, setBarChartData] = useState([]);
    const [barChartXticks, setBarChartXticks] = useState([]);
    const [isFocused, setIsFocused] = useState(true);

    const get_data_for_calendar = async () => {
        var doc_id = "";
        const today = new Date(Date.now())
        const this_month = today.getMonth() + 1;
        const this_year = today.getFullYear();
        const m_prefix = this_month < 10 ? "0" : "";
        const this_month_str = this_year.toString() + "-" + m_prefix + this_month.toString();
        //console.log("selected month=", selectedMonth);
        if(selectedMonth==""){
            doc_id = this_month_str;
        }
        else {
            doc_id = selectedMonth;
        }
        //console.log(doc_id);
        getDailyData(userID, doc_id).then(res => {
            const month_data = res;
            setMonthData(month_data);
            setMarkList(mark_dates(month_data));
        }).catch(err => {
            console.log("from calendar screen;",err);
        });


        getDailyData(userID, this_month_str).then(res => {
            const this_week = get_this_week();
            var week_data = [];
            const tasks = ["Nback", "Stroop", "Fluid"]
             for (const idx in this_week) {
                 var day = this_week[idx];
                 if (day in res) {
                     var sum = 0;
                     for (const idx in tasks) {
                         const task_name = tasks[idx];
                         sum += res[day]["N_" + task_name] * timeLimits[task_name];
                     }
                    week_data.push(sum);
                }
                else {
                    week_data.push(0);
                }
            }
            //week_data = [10, 20, 33, 24, 15, 56, 17];
            const _xticks = this_week.map((d) => {
                const t = new Date(d).getTime();
                return timestamp2showStr(t);
            });
            setBarChartData(week_data);
            setBarChartXticks(_xticks);

        }).catch(err => {
            console.log("from calendar screen;",err);
        });


    }


    useEffect(
        React.useCallback(() => {
            const today = new Date(Date.now())
            const this_month = today.getMonth() + 1;
            const this_year = today.getFullYear();
            const m_prefix = this_month < 10 ? "0" : "";
            const d_prefix = today.getDate() < 10 ? "0" : "";
            const today_str = this_year + "-" + m_prefix + this_month + "-" + d_prefix+today.getDate().toString();
            //console.log(today_str);
            setCurrentDate(today_str);
            setIsFocused(true);
            get_data_for_calendar();
        return () => {
            setSelectedDay(false);
            setSelectedMonth('');
            setDay('');
            setNbackNum(0);
            setStroopNum(0);
            setFluidNum(0);
            setMonthData({});
            setMarkList({});
            setBarChartData([]);
            setBarChartXticks([]);
            setIsFocused(false);
            //console.log(currentDate);
          };
        }, [])
      );
    
    const onRefresh = () => {
        get_data_for_calendar();
        setSelectedDay(false);
    }


    const handle_press_day = (_day) => {
        //console.log(_day.dateString);
        if (monthData[_day["dateString"]] != null) {
            const detail_data = monthData[_day["dateString"]];
            //console.log(day, detail_data);
            setNbackNum(detail_data.N_Nback);
            setStroopNum(detail_data.N_Stroop);
            setFluidNum(detail_data.N_Fluid);
            setSelectedDay(true);
            setDay(_day["dateString"]);
        }
        else{
            setSelectedDay(false);
            setDay('');
            //console.log(data,day)0;
        }
    }

    const handle_change_month = (month) => {
        const _m = parseInt(month.month);
        const m_prefix = _m < 10 ? "0" : "";
        const doc_id = month.year + "-" + m_prefix + month.month;
        setSelectedMonth(doc_id);
        //console.log("change to", doc_id);
        getDailyData(userID, doc_id).then(res => {
            const month_data = res;
            setMonthData(month_data);
            setMarkList(mark_dates(month_data));
        }).catch(err => {
            console.log("from calendar screen;",err);
        });
    }

    const render_detail = ()=>{
        if (!selectedDay) return (
            <View style={ styles.detailContainer}></View>
        );
        return (    
            <View style={ styles.detailContainer}>
                <Text style={styles.detailTitle}>{day}における課題完成状況</Text>
                <View style={styles.detail}>
                    <View style={styles.detail_element}>
                        <img style={styles.icon} href={process.env.PUBLIC_URL+"/Nback.png"}></img>
                        <Text style={styles.detail_text}>N-Back課題</Text>
                        <Text style={styles.detail_text}> {nbackNum} 回 {nbackNum>0?"👍":""}</Text>
                    </View>

                    <View style={styles.detail_element}>
                        <img style={styles.icon} shref={process.env.PUBLIC_URL+"/stroop.png"}></img>
                        <Text style={styles.detail_text}>Stropp課題</Text>
                        <Text style={styles.detail_text}> {stroopNum} 回 {stroopNum>0?"👍":""}</Text>
                    </View>

                    <View style={styles.detail_element}>
                        <img style={styles.icon} href={process.env.PUBLIC_URL+"/fluidIQ.webp"}></img>
                        <Text style={styles.detail_text}>Fluid IQ課題</Text>
                        <Text style={styles.detail_text}> {fluidNum} 回 {fluidNum>0?"👍":""}</Text>
                    </View>
                </View>
            </View>)

    }

    if (!userID) {
        return <BlankScreen></BlankScreen>
    }
    else {
        //console.log("in render:", currentDate);
        return (
            <View>
                {isFocused?
                    <Calendar
                        current={currentDate}
                        key={currentDate}
                        initialDate={currentDate}
                        markedDates={markList}
                        onMonthChange={handle_change_month}
                        dayComponent={({ date, marking, state }) => {
                            const today = new Date(Date.now());
                            const is_today = state == "selected" && parseInt(date.month) == today.getMonth() + 1
                            var color = "white";
                            if (marking != null) {
                                if (marking.level == 1) {
                                    color = "#EEFFBA";
                                }
                                else if (marking.level == 2) {
                                    color = "#D6FABC";
                                }
                                else if (marking.level == 3) {
                                    color = "#D6FABC";
                                }
                            }
                        
                            return (
                                <Pressable onPress={() => handle_press_day(date)}
                                    disabled={state == "disabled"}
                                    style={[styles.date_style, is_today ? styles.today_style : null, {
                                        backgroundColor: color
                                    }]}
                                >
                                    <Text style={{ textAlign: 'center', fontSize: 15, margin: 8, color: state === 'disabled' ? 'gray' : 'black' }}>
                                        {date.day}
                                    </Text>
                                    {marking != null && marking.level == 3 ?
                                        <img style={styles.stamp_style}
                                            href={process.env.PUBLIC_URL+"/stamp.png"}>
                                        </img> : <></>}
                                </Pressable>
                            );
                        }} /> 
                    : <></>
                }
                <View style={styles.detail}>
                    {render_detail()}
                </View>
                <Text style={styles.summary_title}>今週の完成度： (累積時間, 単位：秒)</Text>
                <MyBarChart
                    data={barChartData}
                    xticks={barChartXticks}
                    today_str={timestamp2showStr(Date.now())}
                >
                </MyBarChart>
                {/* <Button title="refresh" onPress={onRefresh}></Button> */}
            </View>
            
        )
    }
}
export default CalendarScreen;
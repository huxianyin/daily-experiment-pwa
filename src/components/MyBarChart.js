import React from 'react'
import { View, StyleSheet } from 'react-native-web'
import {Text as NativeText} from 'react-native-web'
import { BarChart, Grid } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import * as scale from 'd3-scale'

const styles = StyleSheet.create({
    container: {
        height: "25%",
        marginBottom:20,
    },
    chart: {
        flexDirection: 'row',
        height: 150,
        paddingTop: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        
    },
    xticks: {
        width:"100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginHorizontal: 1,
        paddingHorizontal:20,
    },
    xtick: {
        fontSize: 15,
        alignSelf: "center",
        textAlign:"center",
    },
    today: {
        color: "#51A0D5",
    },
    otherDay: {
        color:"black"
    }
})

export class MyBarChart extends React.PureComponent {
    
    render() {
        const CUT_OFF = 0
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                    fontSize={ 14 }
                    fill={ value >= CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                >
                    {value}
                </Text>
            ))
        )
        const today = this.props.today_str;
        return (
            <View style={styles.container}>
                <BarChart
                    style={styles.chart}
                    data={this.props.data}
                    svg={{ fill: '#8DC3A7' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.5}
                    gridMin={0}
                    xScale={ scale.scaleTime }
                >
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                    <Labels/>
                </BarChart>
                <View style={styles.xticks}>
                    {this.props.xticks.map(function (item, i) {
                        //console.log(item);
                        const is_today = item === today;
                        //console.log(is_today);
                        return <NativeText key={i} style={[styles.xtick, is_today?styles.today:styles.otherDay]}>{item}</NativeText>
                    })}
                </View>

                                    
            </View>
        )
    }

}

//export MyBarChart
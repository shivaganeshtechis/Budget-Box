import React from 'react';

export default function PieChart(props) {
    let prevDeg = 0

    return (
        <div className="pieContainer">
            <div className="pieBackground"></div>
            {
                props.data.map((item, index) => {
                    let currentDeg = (360 * item.total_amount_percent) / 100;
                    prevDeg = prevDeg + currentDeg;
                    if (currentDeg < 180) {
                        return (
                            <div className="hold" style={{ transform: `rotate(${prevDeg - currentDeg}deg)` }} key={item.category_name}>
                                <div className="pie" style={{ backgroundColor: `${item.category_color}`, transform: `rotate(${currentDeg}deg)` }}></div>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <div className="hold" style={{ transform: `rotate(${prevDeg - currentDeg}deg)` }} key={item.category_name}>
                                    <div className="pie" style={{ backgroundColor: `${item.category_color}`, transform: `rotate(${180}deg)` }}></div>
                                </div>
                                <div className="hold" style={{ transform: `rotate(${(prevDeg - currentDeg) + 180}deg)` }} key={item.category_name}>
                                    <div className="pie" style={{ backgroundColor: `${item.category_color}`, transform: `rotate(${currentDeg - 180}deg)` }}></div>
                                </div>
                            </div>
                        )
                    }

                })
            }
        </div>
    )
}

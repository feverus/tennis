import React from 'react'
import Card from './Card'

class All extends React.Component {
    constructor(props) {
		super(props);
    }
    render() {
        let p = this.props.players;
        return (
            <div className="allList">
                <div className="secondFixed">
                    <div className="head animate__animated animate__backInLeft animate__faster">
                        <div className="period">Период</div>
                        <div className="rate">rate</div>
                        <div className="all">all</div>
                        <div className="indoors">indoors</div>
                        <div className="clay">clay</div>
                        <div className="grass">grass</div>
                        <div className="hard">hard</div>
                        <div className="notset">not set</div>
                    </div>  
                </div>
                <div className="allTable">
                    {p.fio.map(
                        (fio, nomer) => (
                                <div className="table" key={nomer}>
                                    <Card fio={fio} stat={p.statistics[nomer]} url={p.url[nomer]} key={nomer}/>
                                </div>
                        )
                    )}
                </div>
            </div> 
    )}
}

export default All;
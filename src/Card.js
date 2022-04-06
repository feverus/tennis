import React from 'react'
import VisibilitySensor from "react-visibility-sensor";

class Card  extends React.Component {
    constructor(props) {
		super(props);
        this.onChange = (isVisible) => {
                this.setState({animStyle: isVisible ? ' animate__animated animate__backInLeft animate__faster' : ' animate__animated animate__backOutLeft animate__faster'});        
        }       
        this.state = {
            animStyle: '',
            onChange: this.onChange
        }
    }
    render() {
        let fio=this.props.fio;
        let stat=this.props.stat;
        let url='https://www.tennisexplorer.com'+this.props.url;
        let lineStyle = '';
        if ((stat[365]['all'][2] > 300) & (stat[28]['all'][2] > 150)) {lineStyle = ' green';}
        if ((stat[365]['all'][2] < -300) & (stat[28]['all'][2] < -150)) {lineStyle = ' red';}
        return (
            <VisibilitySensor
                onChange={(isVisible) => {this.onChange(isVisible)}}> 
                <div>
                    <div className={'line'+lineStyle+this.state.animStyle}>                    
                        <div className="card">
                            <div className="player"><a href={url} target="_blank">{fio}</a></div>
                        </div>
                        <div className="card">                    
                            <div className="period">Месяц</div>
                            <div className="rate">{stat[28]['all'][2]}</div>
                            <div className="all">{stat[28]['all'][0]}<br/>{stat[28]['all'][1]}</div>
                            <div className="indoors">{stat[28]['indoors'][0]}<br/>{stat[28]['indoors'][1]}</div>
                            <div className="clay">{stat[28]['clay'][0]}<br/>{stat[28]['clay'][1]}</div>
                            <div className="grass">{stat[28]['grass'][0]}<br/>{stat[28]['grass'][1]}</div>
                            <div className="hard">{stat[28]['hard'][0]}<br/>{stat[28]['hard'][1]}</div>
                            <div className="notset">{stat[28]['not set'][0]}<br/>{stat[28]['not set'][1]}</div>
                        </div>
                        <div className="card">
                            <div className="period">Год</div>
                            <div className="rate">{stat[365]['all'][2]}</div>
                            <div className="all">{stat[365]['all'][0]}<br/>{stat[365]['all'][1]}</div>
                            <div className="indoors">{stat[365]['indoors'][0]}<br/>{stat[365]['indoors'][1]}</div>
                            <div className="clay">{stat[365]['clay'][0]}<br/>{stat[365]['clay'][1]}</div>
                            <div className="grass">{stat[365]['grass'][0]}<br/>{stat[365]['grass'][1]}</div>
                            <div className="hard">{stat[365]['hard'][0]}<br/>{stat[365]['hard'][1]}</div>
                            <div className="notset">{stat[365]['not set'][0]}<br/>{stat[365]['not set'][1]}</div>
                        </div>      
                    </div> 
                </div>
            </VisibilitySensor>
        )
    }
}

export default Card;
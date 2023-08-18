import React from 'react'
import VisibilitySensor from "react-visibility-sensor";

class Card  extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = (isVisible) => {
			const animDirection = isVisible ? 'In' : 'Out'
			this.setState({animStyle: ` animate__animated animate__back${animDirection}Left animate__faster`});
		}
		this.state = {
			animStyle: '',
			onChange: this.onChange
		}
	}
	render() {
		const stat = this.props.stat
		const url = 'https://www.tennisexplorer.com'+this.props.url
		let lineStyle
		if ((stat[365]['all'][2] > 300) & (stat[28]['all'][2] > 150)) {lineStyle = ' green';}
		if ((stat[365]['all'][2] < -300) & (stat[28]['all'][2] < -150)) {lineStyle = ' red';}

		const showStats = (stat, period = 'Месяц') => {
			if (!stat) return <div className="card">Ошибка получения статистики</div>

			return (
				<div className="card">
					<div className="period">{period}</div>
					<div className="rate">{stat['all'][2]}</div>
					<div className="all">{stat['all'][0]}<br />{stat['all'][1]}</div>
					<div className="indoors">{stat['indoors'][0]}<br />{stat['indoors'][1]}</div>
					<div className="clay">{stat['clay'][0]}<br />{stat['clay'][1]}</div>
					<div className="grass">{stat['grass'][0]}<br />{stat['grass'][1]}</div>
					<div className="hard">{stat['hard'][0]}<br />{stat['hard'][1]}</div>
					<div className="notset">{stat['not set'][0]}<br />{stat['not set'][1]}</div>
				</div>
			)
		}

		return (
			<VisibilitySensor
				onChange={(isVisible) => {!this.props.withoutVisibilitySensor && this.onChange(isVisible)}}> 
				<div>
					<div className={'line' + lineStyle + ' ' + this.state.animStyle}>                    
						<div className="card">
							<div className="player"><a href={url} rel="noreferrer" target="_blank">{this.props.fio}</a></div>
						</div>
						{showStats(stat[28])}
						{showStats(stat[365], 'Год')}     
					</div> 
				</div>
			</VisibilitySensor>
		)
	}
}

export default Card;
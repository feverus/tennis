import React from 'react'

class ProgressBar extends React.Component {
	render() {
		return (
			<div className={'update-bar ' + this.props.visible}>
				<div className="progressbar-update-bar">
					<div className="progressbar-complete" style={{width: `${this.props.progressProcent}%`}}>
						<div className="progressbar-liquid"></div>
					</div>
				<span className="progress">{this.props.progressProcent}%</span>
				</div>
			</div>
		)
	}
}
export default ProgressBar;
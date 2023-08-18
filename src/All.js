import React from 'react'
import Card from './Card'
import { TableHead } from './TableHead';

class All extends React.Component {
	render() {
		let p = this.props.players;
		return (
			<div className="allList">
				<div className="secondFixed">
					{TableHead}
				</div>
				<div className="allTable">
					{p.fio.map(
						(fio, nomer) => (
								<div className="table" key={fio}>
									<Card fio={fio} stat={p.statistics[nomer]} url={p.url[nomer]} />
								</div>
						)
					)}
				</div>
			</div> 
		)
	}
}

export default All;
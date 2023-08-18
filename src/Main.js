import React from 'react'
import All from './All'
import Compare from './Compare'
import ProgressBar from './ProgressBar'
import { getBase } from './api/getBase'
class Main extends React.Component {
	constructor(props) {
		super(props);  

		this.checkUpdate = () => {
			function echoMonth(match, nomer, offset, string) {
				let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
				return ' '+months[nomer-1]+' ';
			}
			if (this.state.mode==='buttons_only') {

				console.log('Проверяем статус процесса обновления')
				fetch("update_status.txt", {cache: "no-store"})
				.then(result => result.json())
				.then((result) => {
					const timeOfUpdate = result.date
					const timeForHuman = timeOfUpdate.replace(/ ([\d]+) /, echoMonth)
					const now = new Date()
					const timeOfNow = now.getDate()+' '+(now.getMonth()+1)+' '+now.getFullYear()
					let progress = "Статистика загружена"
					let progressProcent = false

					console.log('Повторный запуск проверки + статистика устарела')
					if ((result.ready==='no') && (this.props.statLoaded===true)) {
						progress += `, на дату ${timeForHuman}. Обновление уже запущено, действий не требуется.`;
						progressProcent = ((Math.floor(result.count / 36)));
						this.updateInProcess = setTimeout(this.checkUpdate, 10000); 
						this.setState({"progress":progress, "progressProcent": progressProcent});
					} else {

						console.log('Первый запуск проверки')
						//меняем безусловное получение новой базы на проверку локалстораджа
						getBase(timeOfUpdate)
						.then((res) => {

							console.log('Cтатистика устарела')
							if (result.ready==='no') {
								progress += ', на дату '+timeForHuman+'. Обновление уже запущено, действий не требуется.';
								progressProcent = ((Math.floor(result.count / 36)));
								this.updateInProcess = setTimeout(this.checkUpdate, 10000);                            
							} else {
								if (timeOfNow===timeOfUpdate) {
									progress += ', актуальна на сегодня. Обновление не требуется.';
								} else {
									console.log('обновляем статистику с сайта');
									progress += `, на дату ${timeForHuman}. Инициировано обновление.`;
									fetch("update.php", {cache: "no-store"});
									this.updateInProcess = setTimeout(this.checkUpdate, 10000);                                
								}
							}
							this.setState({"statLoaded": true, "progress":progress, 'players': res, "progressProcent": progressProcent});
						})   
					}                
				})
				.catch(err => {
					console.log(err);
					this.updateInProcess = setTimeout(this.checkUpdate, 1000);
				})
			}
		}
		this.ShowAll = () => {
			if (this.state.mode!=='all') {
				this.setState({'mode': 'all'});
			} else {
				this.setState({'mode': 'buttons_only'});
			}            
		}
		this.ShowCompare = () => {
			if (this.state.mode!=='compare') {
				this.setState({'mode': 'compare'});
			} else {
				this.setState({'mode': 'buttons_only'});
			}            
		}        
		this.state = {
			players: [],
			start: true,
			updateInProcess: false,
			statLoaded: false,
			progressProcent: false,
			progress: 'Статистика не загружена',
			mode: 'buttons_only',

			checkUpdate: this.checkUpdate,
			ShowAll: this.ShowAll,
			ShowCompare: this.ShowCompare
		}
	}
	render() {
		if (this.state.start) {
			this.checkUpdate()
			this.setState({'start': false})
		}
		
		switch (this.state.mode) {
			case 'all':
				return(
					<div className="main">
						<div className="topFixed">
							<button onClick={() => this.ShowAll()} className="animate__animated animate__backInDown animate__faster">Назад</button>
						</div>
						<All players={this.state.players}/>
					</div> 
				)
			case 'compare':
				return(
					<div className="main">
						<div className="topFixed">
							<button onClick={() => this.ShowCompare()} className="animate__animated animate__backInDown animate__faster">Назад</button>
						</div>
						<Compare players={this.state.players}/>
					</div> 
				)	
			default:
				return (
					<div className="main animate__animated animate__backInDown animate__faster">
						<div className="progress">{this.state.progress}</div>
						<ProgressBar visible={(this.state.progressProcent===false)?'none':'block'} progressProcent={this.state.progressProcent} />
						<button onClick={() => this.ShowAll()}>Показать всех</button>
						<button onClick={() => this.ShowCompare()}>Сравнить пару игроков</button>
					</div>
				)
		}
	}
}

export default Main;
import React from 'react'
import All from './All'
import Compare from './Compare'
import ProgressBar from './ProgressBar'


class Main extends React.Component {
	constructor(props) {
		super(props);  

        this.checkUpdate = () => {
            function echoMonth(match, nomer, offset, string) {
                let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                return ' '+months[nomer-1]+' ';
            }
            if (this.state.mode==='buttons_only') {
                console.log('проверка');
                fetch("update_status.txt", {cache: "no-store"})
                .then(result => result.json())
                .then((result) => {
                    
                    let timeOfUpdate = result.date;
                    let timeForHuman = timeOfUpdate.replace(/ ([\d]+) /, echoMonth);
                    let now = new Date();
                    let timeOfNow = now.getDate()+' '+(now.getMonth()+1)+' '+now.getFullYear();
                    let statLoaded = true;
                    let progress = "Статистика загружена";
                    let progressProcent = false;
                    if ((result.ready==='no') & (this.props.statLoaded===true)) {
                        progress += ', на дату '+timeForHuman+'. Обновление уже запущено, действий не требуется.';
                        progressProcent = ((Math.floor(result.count / 36)));
                        this.updateInProcess = setTimeout(this.checkUpdate, 10000); 
                        this.setState({"progress":progress, "progressProcent": progressProcent});
                    } else {
                        fetch(timeOfUpdate+"_json.txt", {cache: "no-store"})
                        .then(res => res.json())    
                        .then((res) => {
                            if (result.ready==='no') {
                                progress += ', на дату '+timeForHuman+'. Обновление уже запущено, действий не требуется.';
                                progressProcent = ((Math.floor(result.count / 36)));
                                this.updateInProcess = setTimeout(this.checkUpdate, 10000);                            
                            } else {
                                if (timeOfNow===timeOfUpdate) {
                                    progress += ', актуальна на сегодня. Обновление не требуется.';
                                } else {
                                    progress += ', на дату '+timeForHuman+'. Инициировано обновление.';
                                    console.log('обновляем статистику с сайта');
                                    fetch("update.php", {cache: "no-store"});
                                    this.updateInProcess = setTimeout(this.checkUpdate, 10000);                                
                                }
                            }
                            this.setState({"statLoaded": statLoaded, "progress":progress, 'players': res, "progressProcent": progressProcent});
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
            this.checkUpdate();
            this.setState({'start': false});
        }
        if (this.state.mode==='buttons_only') {
            return (
                <div className="main animate__animated animate__backInDown animate__faster">
                    <div className="progress">{this.state.progress}</div>
                    <ProgressBar visible={(this.state.progressProcent===false)?'none':'block'} progressProcent={this.state.progressProcent} />
                    <button onClick={() => this.ShowAll()}>Показать всех</button>
                    <button onClick={() => this.ShowCompare()}>Сравнить пару игроков</button>
                </div>
            )
        }
        if (this.state.mode==='all') {
            return(
                <div className="main">
                    <div className="topFixed">
                        <button onClick={() => this.ShowAll()} className="animate__animated animate__backInDown animate__faster">Назад</button>
                    </div>
                    <All players={this.state.players}/>
                </div> 
            )     
        }  
        if (this.state.mode==='compare') {
            return(
                <div className="main">
                    <div className="topFixed">
                        <button onClick={() => this.ShowCompare()} className="animate__animated animate__backInDown animate__faster">Назад</button>
                    </div>
                    <Compare players={this.state.players}/>
                </div> 
            )     
        }        
	}


}

export default Main;
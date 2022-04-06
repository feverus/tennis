import React from 'react'
import Card from './Card'
import ReactAutocomplete from 'react-autocomplete'
import {translit} from './other.js'

class Compare extends React.Component {
    constructor(props) {
		super(props);
        this.playerChoosed = (event, nomer)=> {
            let i = 0;
            let p = this.props.players;
            let copy = this.state.players;            
            let items = [[],[]];
            let finded0 = this.state.finded0;
            let finded1 = this.state.finded1;
            copy[nomer] = translit(event);
            let fIndexes = [];
            let f = p.fio.filter((item, index)=> {
                let inArray = item.toUpperCase().includes(copy[nomer].toUpperCase());
                if ( inArray ) fIndexes.push(index);  
                return inArray;
            });
            f.map((p) => {items[nomer].push({ id: +i, label: p });i++;});
            if ((copy[nomer].length===0) || (fIndexes.length!==1)) {fIndexes[0] = -1;}
            if (nomer===0) {finded0 = fIndexes[0];}
            if (nomer===1) {finded1 = fIndexes[0];} 
            console.log('-'+fIndexes.length); 
            console.log(fIndexes); 
            this.setState({players: copy, items: items, finded0: finded0, finded1: finded1});
        }        
        this.state = {
            players: ['1', '2'],
            items: [[],[]],
            finded0: -100,
            finded1: -100,

            playerChoosed: this.playerChoosed
        }
    }



    render() {
        let p = this.props.players;
        let finded0 = this.state.finded0;
        let finded1 = this.state.finded1;
        let st = ['block animate__animated animate__backInLeft animate__faster', 'block animate__animated animate__backInRight animate__faster'];
        if (finded0===-100) {finded0=0;st[0]='none';}
        if (finded1===-100) {finded1=0;st[1]='none';}        
        if (finded0===-1) {finded0=0;st[0]='animate__animated animate__backOutLeft animate__faster';}
        if (finded1===-1) {finded1=0;st[1]='animate__animated animate__backOutRight animate__faster';}
        return (
            <div className="compare">
                <div className="allTable">
                    <div className="inputs animate__animated animate__backInDown animate__faster">
                        <ReactAutocomplete
                            items = {this.state.items[0]}
                            getItemValue={item => item.label}
                            renderItem={(item, highlighted) =>
                            <div
                                key={item.id}
                                style={{ backgroundColor: highlighted ? '#2b995b' : 'transparent'}}
                            >
                                {item.label}
                            </div>
                            }
                            value={this.state.players[0]}
                            onChange={(event)=>{this.playerChoosed(event.target.value, 0)}}
                            onSelect={(event)=>{this.playerChoosed(event, 0)}}
                            menuStyle={{position: 'absolute', maxHeight: '300px', top: 40, left: 0, zIndex: 100, overflow: 'scroll', textAlign: 'center', backgroundColor: '#fff'}}
                        />
                        <ReactAutocomplete
                            items = {this.state.items[1]}
                            getItemValue={item => item.label}
                            renderItem={(item, highlighted) =>
                            <div
                                key={item.id}
                                style={{ backgroundColor: highlighted ? '#2b995b' : 'transparent'}}
                            >
                                {item.label}
                            </div>
                            }
                            value={this.state.players[1]}
                            onChange={(event)=>{this.playerChoosed(event.target.value, 1)}}
                            onSelect={(event)=>{this.playerChoosed(event, 1)}}
                            menuStyle={{position: 'absolute', maxHeight: '300px', top: 40, left: '50%', zIndex: 100, overflow: 'scroll', textAlign: 'center', backgroundColor: '#fff'}}
                        />

                    </div>                    
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
                    <div className={st[0]}>
                        <Card fio={p.fio[finded0]} stat={p.statistics[finded0]} url={p.url[finded0]} />
                    </div>
                    <div className={st[1]}>
                        <Card fio={p.fio[finded1]} stat={p.statistics[finded1]} url={p.url[finded1]} />
                    </div>
                </div>
            </div>
    )}
}

export default Compare;
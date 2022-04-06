import React from 'react'

class ProgressBar extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {
        let progress = this.props.progressProcent;
        return (
            <div className={'update-bar '+this.props.visible}>
                <div className="progressbar-update-bar">
                    <div className="progressbar-complete" style={{width: `${progress}%`}}>
                        <div className="progressbar-liquid"></div>
                    </div>
                <span className="progress">{progress}%</span>
                </div>
            </div>
    )}
}
export default ProgressBar;
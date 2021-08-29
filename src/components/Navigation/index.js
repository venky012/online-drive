import React from 'react';
import './styles.css';

class Navigation extends React.Component {

    showPath = path => {
        const pathArr = path.split('/');
        const arr = [];
      
        pathArr.map((p, _) => {
          arr.push(<span key={_ + 1}>{` / ${p} `}</span>);
        });
        return arr;
    };

    render(){
        let path = this.props.path;
        return (
            <div className="container navigation">
                <div
                    style={path === 'root'?{ marginTop:'40px' }:{ marginTop:'40px', cursor: 'pointer' }}
                    onClick={this.props.goBackClick}
                >
                    <svg viewBox="0 0 476.737 476.737" height={'20px'} style={{transform: 'rotate(-90deg)'}}>
                        <path
                            fill={path === 'root' ? '#acb9c3' : '#545B61'}
                            d="M238.369 0C106.726 0 0 106.726 0 238.369c0 131.675 106.726 238.369 238.369 238.369 131.675 0 238.369-106.694 238.369-238.369C476.737 106.726 370.043 0 238.369 0zm106.598 217.837c-6.134 6.198-16.273 6.198-22.47 0L254.26 149.6v247.681c0 8.74-7.151 15.891-15.891 15.891-8.772 0-15.891-7.151-15.891-15.891V149.6l-68.205 68.237c-6.198 6.198-16.273 6.198-22.47 0s-6.198-16.273 0-22.47l95.347-95.347.095-.095 5.022-3.337a15.684 15.684 0 0 1 12.109 0l5.212 3.401 95.347 95.347c6.23 6.228 6.23 16.272.032 22.501z"
                        />
                    </svg>
                </div>
                <div className="path">{this.showPath(path)}</div>
            </div>
        )
    }

}

export default Navigation;
import React from "react";
import Tilt from 'react-parallax-tilt'
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2 flex justify-center items-center" options ={{max : 55}}>
                <div className="Tilt-inner pa3">
                    <img alt='logo' style={{ paddingTop: '5px' }} src={brain} />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;
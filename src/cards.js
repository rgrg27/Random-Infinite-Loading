import React from 'react';



export default (props) => {
    return (
        <div className='card' key={props.image}>
          <div className="card-img" >
            <img className='card-img-top'src={props.image}  alt='' />
          </div>              
        </div>
    )
}
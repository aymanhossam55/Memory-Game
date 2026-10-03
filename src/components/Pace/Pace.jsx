import './pace.css'
import PropTypes from 'prop-types';

const Pace = ({Paces,pace,setPace,setAttempts}) => {

  
    if (pace === "easy") {
      setAttempts(20)
    }else if(pace === "medium"){
      setAttempts(16)
    }else if(pace === "hard"){
      setAttempts(12)
    }else if(pace === "pro"){
      setAttempts(8)
    }


  return (
    <div>
        <h3 className='text-xl text-gray-600 mb-2'>Pace:</h3>
        <div className="pace-container p-4 mb-3 flex flex-wrap bg-white rounded overflow-hidden">
          {Paces.map((pacesOption) => {
            return (
              <div key={pacesOption}>
                <input className='me-1' type="radio" 
                name='pace' 
                id={pacesOption}
                value={pacesOption} 
                onChange={e => {
                  console.log((e.target.value))
                  setPace(e.target.value)
                }}
                checked={pace === pacesOption}
                />
                <label className='me-4' htmlFor={pacesOption}>{pacesOption}</label>
              </div>
            )
          })}
        </div>
    </div>
  )
}

Pace.propTypes = {
  Paces: PropTypes.arrayOf(PropTypes.string).isRequired,
  pace: PropTypes.string.isRequired,
  setPace: PropTypes.func.isRequired,
  setAttempts: PropTypes.func.isRequired
};

export default Pace;
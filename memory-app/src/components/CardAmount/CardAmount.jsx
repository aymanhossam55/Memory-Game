import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import './card.css'
import PropTypes from 'prop-types';


const CardAmount = ({ Amount, setAmount, setImages }) => {

   //increase counter
   const increase = () => {
    if (Amount < 16) {
      setAmount(count => count + 2);
      setImages([...Array(Amount)].fill({ src: { medium: '' } }));
    }
  };
 
  //decrease counter
  const decrease = () => {
    if (Amount > 4) {
      setAmount(count => count - 2);
      setImages([...Array(Amount)].fill({ src: { medium: '' } }));
    }
  };
  


  return (
    <div>
        <h3 className='text-xl text-gray-600 mb-2'>Amount Of Cards:</h3>
        <div className="card-container p-4 mb-3 flex bg-white rounded overflow-hidden flex justify-center">
          <span  onClick={decrease}><RemoveIcon className='bg-gray-200 rounded-3xl'/></span>
          <h4 className='me-8 ms-8'>{Amount}</h4>
          <span onClick={increase}><AddIcon className='bg-gray-200 rounded-3xl'/></span>
        </div>
    </div>
  )
}

CardAmount.propTypes = {
  Amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  setImages: PropTypes.func.isRequired
};

export default CardAmount
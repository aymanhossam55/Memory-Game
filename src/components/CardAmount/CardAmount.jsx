import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

import "./card.css";

const CardAmount = ({
    Amount,
    setAmount,
}) => {
    const increase = () => {
        if (Amount < 16) {
            setAmount((count) => count + 2);
        }
    };

    const decrease = () => {
        if (Amount > 4) {
            setAmount((count) => count - 2);
        }
    };

    return (
        <div>
            <h3 className="text-xl text-gray-600 mb-2">
                Amount Of Cards:
            </h3>

            <div className="card-amount-container p-4 mb-3 flex bg-white rounded overflow-hidden justify-center items-center">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={Amount <= 4}
                    className="amount-button"
                    aria-label="Decrease card amount"
                >
                    <RemoveIcon className="bg-gray-200 rounded-3xl" />
                </button>

                <h4 className="me-8 ms-8">
                    {Amount}
                </h4>

                <button
                    type="button"
                    onClick={increase}
                    disabled={Amount >= 16}
                    className="amount-button"
                    aria-label="Increase card amount"
                >
                    <AddIcon className="bg-gray-200 rounded-3xl" />
                </button>
            </div>
        </div>
    );
};

CardAmount.propTypes = {
    Amount: PropTypes.number.isRequired,
    setAmount: PropTypes.func.isRequired,
};

export default CardAmount;
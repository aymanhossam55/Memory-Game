import PropTypes from "prop-types";

import "./pace.css";

const Pace = ({
    Paces,
    pace,
    setPace,
}) => {
    return (
        <div>
            <h3 className="text-xl text-gray-600 mb-2">
                Pace:
            </h3>

            <div className="pace-container p-4 mb-3 flex flex-wrap bg-white rounded overflow-hidden">
                {Paces.map((paceOption) => (
                    <div
                        key={paceOption}
                        className="pace-option"
                    >
                        <input
                            className="me-1"
                            type="radio"
                            name="pace"
                            id={paceOption}
                            value={paceOption}
                            onChange={(e) =>
                                setPace(
                                    e.target.value
                                )
                            }
                            checked={
                                pace ===
                                paceOption
                            }
                        />

                        <label
                            className="me-4"
                            htmlFor={paceOption}
                        >
                            {paceOption}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

Pace.propTypes = {
    Paces: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired,
    pace: PropTypes.string.isRequired,
    setPace: PropTypes.func.isRequired,
};

export default Pace;
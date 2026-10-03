import PropTypes from "prop-types";

import "./category.css";

const Category = ({
    category,
    setCategory,
    Queries,
}) => {
    return (
        <div>
            <h3 className="text-xl text-gray-600 mb-2">
                Category:
            </h3>

            <div className="category-container p-4 mb-3 flex flex-wrap bg-white rounded overflow-hidden">
                {Queries.map((queryOption) => (
                    <div
                        key={queryOption}
                        className="category-option"
                    >
                        <input
                            className="me-1"
                            type="radio"
                            name="category"
                            id={queryOption}
                            value={queryOption}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                            checked={
                                category ===
                                queryOption
                            }
                        />

                        <label
                            className="me-4"
                            htmlFor={queryOption}
                        >
                            {queryOption}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

Category.propTypes = {
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    Queries: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired,
};

export default Category;
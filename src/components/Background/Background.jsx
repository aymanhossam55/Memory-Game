import "./background.css";

const cubes = Array.from({ length: 10 });

const Background = () => {
    return (
        <div className="background-image">
            <ul className="cubes">
                {cubes.map((_, i) => (
                    <li key={i}></li>
                ))}
            </ul>
        </div>
    );
};

export default Background;
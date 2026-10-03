import './background.css'

const cubes = [...Array(10)];

const Background = () => {
  return (
    <div>
        <div className="background-image">
        <ul className="cubes">
            {cubes.map((cube, i) => (
                <li key={i}></li>
            ))}
        </ul>
        </div>
    </div>
  )
}

export default Background
import './home.css'
import Header from '../Header/Header'
import Background from '../Background/Background'
import Game from '../Game/Game'

const Home = () => {
  return (
    <div>
        <Background />
        <Header/>
        <Game/>
    </div>
  )
}

export default Home
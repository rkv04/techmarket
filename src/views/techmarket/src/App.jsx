import './App.css'
import './Home.jsx'
import Layout from './Layout'
import BackgroundGrid from './BackgroundGrid.jsx';
import Home from './Home.jsx';

function App() {
  return (
    <>
    {/* <BackgroundGrid /> */}
      <Layout>
        <Home />
      </Layout>
    </>
  )
}

export default App;

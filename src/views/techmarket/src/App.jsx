import './App.css'
import './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import BackgroundGrid from './components/BackgroundGrid.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <>
      <Layout>
        <Home />
      </Layout>
    </>
  )
}

export default App;

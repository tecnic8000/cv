import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "./style/style1.css"
import { Button } from './components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"

function App() {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    fetch('/cv.md')
      .then(res => res.text())
      .then(content => {
        const headlineLines = content.split('\n')
          .filter(line => line.startsWith('##'))
          .map(line => line.replace(/^#+\s*/, ''));
        setHeadlines(headlineLines);
      });
  }, []);

  return (
    <>
      <div className='bg-blue-700'>TRAN MINH HOANG</div>
      <div className="cv-headlines">
        {headlines.map((headline, index) => (
          <div key={index}>{headline}</div>
        ))}
      </div>
      <Button>CLICK ME</Button>
      <Checkbox/>
      <br/>
      <div>{headlines[0]}</div>
    </>
  )
}

export default App

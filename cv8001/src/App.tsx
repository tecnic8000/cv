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
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(content => {
        console.log('Raw content:', content); // Debug: see what we're getting
        const headlineLines = content.split('\n')
          .filter(line => line.startsWith('#'))
          .map(line => line.replace(/^#+\s*/, ''));
        console.log('Extracted headlines:', headlineLines); // Debug: see the result
        setHeadlines(headlineLines);
      })
      .catch(error => {
        console.error('Error fetching cv.md:', error);
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
      <div>{headlines[1]}</div>
    </>
  )
}

export default App

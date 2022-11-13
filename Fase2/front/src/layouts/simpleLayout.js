import React from 'react'
import { useState } from 'react'
import {  Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import Banner from '../components/banner/banner'
import Content from '../components/content/content'
import Loading from '../components/tools/loading'
import ReactWordcloud from 'react-wordcloud';
import Alert from '../components/tools/alert'
import { useRef } from 'react'
import { PolarArea } from 'react-chartjs-2'


const SimpleLayout = (props) => {
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [words, setWords] = useState([])
  const [error, setError] = useState(null)
  const [stars, setStars] = useState([])
  const [chart, setChart] = useState(null)
  const chartReference = useRef()

  const [result, setResult] = useState({})
  

  const callbacks = {
    getWordColor: word => word.value > 50 ? "green" : "red",
  }
  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
  };
  const size = [600, 250];


  const handleClean = async() =>{
    setLoading(true)
    setSubmitted(false)
    setWords([])
    setComment('')
    setError(null)
    setResult({})
    setStars([])
    setLoading(false)
  }


  const handleSummit = async() =>{
    setError(null)
    setLoading(true)
    if(!comment || comment === ''){
      setError('Not comment received')
      setLoading(false)
      return
    }




    await  new Promise(resolve => setTimeout(resolve, 300))  
    
    setWords([
      {
        text: 'told',
        value: 100,
      },
      {
        text: 'mistake',
        value: 11,
      },
      {
        text: 'thought',
        value: 16,
      },
      {
        text: 'bad',
        value: 17,
      },
      {
        text: 'perreo',
        value: 17,
      },
      {
        text: 'music',
        value: 17,
      },
    ])

    
    
    await handleStars(3.5)

    setSubmitted(true)
    
    
    setLoading(false)
    
  }

  const processStatistics = (stats) =>{
    const aux = {
      points : [],
      labels: []
    }

    let keys = Object.keys(stats); 
    let max = 0
    for(let i=0; i< keys.length; i++){
      let key = keys[i];
      if(stats[key]){
        if(Number.isFinite(key.match(/(\d+)/g))){
          if(max < stats[key]['precision']) max = stats[key]['precision']
          const num = Number.parseInt(key.match(/(\d+)/g)) 
          aux.points.push(stats[key]['precision'])
          aux.labels.push( num === 1 ? num + ' star': num + ' stars' )
        }
      }
    }
    setStars(max)
    setChart(aux)
  }

  const handleStars =async(num) =>{

    let max = 0
    const aux = []
    for(let i = 0; i < num; i++){
      if(num - i >= 1){
        aux.push(1)
      } else if( num - i > 0){
        aux.push(0.5)
      } 
      max = i + 1
    }
    for(let i = 0; i < 5 - max; i++){
      aux.push(0)
    }
    setStars(aux)
    console.log('stars', aux)
  }
  
  
  
  return (
    
    <>
    <Banner/>
      { error ? <Alert variant='error'> {error} </Alert>: null}
    <Content>
      { loading ? <Loading /> : null}
      <Col>
        <Row className='justify-content-center'>
          <Col sm={ submitted? 4 : 6} >
            { !submitted ? 
              <>
                <br />
                <h2 className='text-center'>Enter a comment to be evaluated</h2>
              </>
            
            : null}
            <br />

            { !submitted ? 
              
              <FloatingLabel
              controlId="floatingTextarea"
              label="Comment"
              className="m-3"
              >
                <Form.Control disabled={submitted} value={comment} onChange={(e) => setComment(e.target.value)} as="textarea" placeholder="Enter a comment here" />
              </FloatingLabel>
            
            : <q className='h4'>{comment}</q>}

            { !submitted ? 
              <Col className='text-center'  >
                <Button disabled={submitted} onClick={()=> handleSummit()} variant='warning'>Submit</Button>
              </Col>
            : null}
            
          </Col>
          { submitted ? 
            <Col className='text-center'>
              <br />
              {submitted && stars.length  ?  
                  stars.map(_s => {
                    if(_s === 1){
                      return <i className="fa-solid fa-star text-warning"></i>
                    } else if(_s === 0.5){
                      return <i className="fa-solid fa-star-half-stroke  text-warning"></i>
                    } 
                     return <i className="fa-regular fa-star  text-warning"></i>
                  })
              : null }

              {submitted && chart?.points?.length ? 
              
              <Row className='justify-content-center'>
                <Col sm={6}>
                  <PolarArea
                    ref={chartReference}
                    data={{
                      labels: chart.labels,
                      datasets: [
                          {
                            label: 'Precision',
                            data: chart.points,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 205, 86, 0.7)',
                                'rgba(201, 203, 207, 0.7)',
                                'rgba(54, 162, 235, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 89, 122, 0.7)',
                                'rgba(65, 182, 182, 0.7)',
                                'rgba(245, 195, 76, 0.7)',
                                'rgba(191, 193, 197, 0.7)',
                                'rgba(44, 152, 225, 0.7)'
                            ],
                            borderWidth: 1,
                            },
                      ],
                    }}
                    options={{
                      scale: {
                        min: 0,
                        max: 100
                      }
                    }}
                  />
                </Col>
              </Row>

              
              :null}

              {submitted && words.length  ? 
                <ReactWordcloud options={options} size={size} callbacks={callbacks} words={words}/> 
              : null }

              {submitted ? <Button  onClick={()=> handleClean()} variant='warning'>Try another</Button> : null}            
            </Col>
          
          : null}
          
        </Row>
      </Col>
    </Content>
    </>
    
    
    )
    
  }
  
  export default SimpleLayout
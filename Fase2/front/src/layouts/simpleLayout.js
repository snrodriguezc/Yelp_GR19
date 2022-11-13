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
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

ChartJS.overrides.polarArea.plugins.legend.display = false;

const SimpleLayout = (props) => {
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [words, setWords] = useState([])
  const [error, setError] = useState(null)
  const [stars, setStars] = useState([])
  const [chartPrecision, setChartPrecision] = useState(null)
  const chartPrecisionReference = useRef()

  const [chartReCall, setChartReCall] = useState(null)
  const chartReCallReference = useRef()

  const [chartF1, setChartF1] = useState(null)
  const chartF1Reference = useRef()

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

    const response = {"precision":{"0":0.6307692308,"1":0.2,"2":0.2105263158,"3":0.3626373626,"4":0.6806282723,"avg":0.5130036231},"recall":{"0":0.6833333333,"1":0.0909090909,"2":0.1860465116,"3":0.375,"4":0.7386363636,"avg":0.5375},"f1-score":{"0":0.656,"1":0.125,"2":0.1975308642,"3":0.3687150838,"4":0.7084468665,"avg":0.5227810076},"support":{"0":60.0,"1":33.0,"2":43.0,"3":88.0,"4":176.0,"avg":400.0}}
    
    processStatistics(response)
  
    setSubmitted(true)
    
    
    setLoading(false)
    
  }

  const processStatistics = (stats) =>{
    const auxPrecision = {
      points : [],
      labels: [],
      avg:0
    }
    const auxReCall= {
      points : [],
      labels: [],
      avg:0
    }

    const auxF1= {
      points : [],
      labels: [],
      avg:0
    }

    let keys = Object.keys(stats['precision']); 
    let max = 0
    let stars = 0
    for(let i=0; i< keys.length; i++){
      let key = keys[i];
      if(stats['precision'][key]){
        const digit = key.match(/(\d+)/g)
        if(digit && digit[0]){

          const num = Number.parseInt(digit[0]) 
          if(max < stats['precision'][key]) {
            max = stats['precision'][key]
            stars = num
          }
          auxPrecision.points.push(stats['precision'][key])
          auxPrecision.labels.push( num === 1 ? num + ' star': num + ' stars' )
          
        } else if(key === 'avg'){
          auxPrecision.avg = stats['precision'][key]
        }
      }
    }
    keys = Object.keys(stats['recall']); 
    for(let i=0; i< keys.length; i++){
      let key = keys[i];
      if(stats['recall'][key]){
        const digit = key.match(/(\d+)/g)
        if(digit && digit[0]){
          const num = Number.parseInt(digit[0]) 
          auxReCall.points.push(stats['recall'][key])
          auxReCall.labels.push( num === 1 ? num + ' star': num + ' stars' )
          
        } else if(key === 'avg'){
          auxReCall.avg = stats['recall'][key]
        }
      }
    }
    keys = Object.keys(stats['f1-score']); 
    for(let i=0; i< keys.length; i++){
      let key = keys[i];
      if(stats['f1-score'][key]){
        const digit = key.match(/(\d+)/g)
        if(digit && digit[0]){
          const num = Number.parseInt(digit[0]) 
          auxF1.points.push(stats['f1-score'][key])
          auxF1.labels.push( num === 1 ? num + ' star': num + ' stars' )
        } else if(key === 'avg'){
          auxF1.avg = stats['f1-score'][key]
        }
      }
    }
    handleStars(stars)
    setChartPrecision(auxPrecision)
    setChartReCall(auxReCall)
    setChartF1(auxF1)
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
              
            <br />
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
              {submitted ? <Button  onClick={()=> handleClean()} variant='warning'>Try another</Button> : null} 
              <br /><br />
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
              <br /><br />
              {submitted && chartPrecision?.points?.length ? 
              
              <Row className='justify-content-center'>
                <Col style={{height: '250px', maxWidth: '250px'}}>
                  <h5>Precision</h5>
                  <PolarArea
                    ref={chartPrecisionReference}
                    data={{
                      labels: chartPrecision.labels,
                      datasets: [
                          {
                            label: 'Precision',
                            data: chartPrecision.points,
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
                        max: 1
                      }
                    }}
                  />
                  <h6><span className='fw-bold'>AVG:</span> {Math.round(chartPrecision.avg *100)/100}</h6>
                </Col>
                <Col style={{height: '250px', maxWidth: '250px'}}>
                  <h5>Recall</h5>
                  <PolarArea
                    ref={chartReCallReference}
                    data={{
                      labels: chartReCall.labels,
                      datasets: [
                          {
                            label: 'Recall',
                            data: chartReCall.points,
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
                        max: 1
                      }
                    }}
                  />
                  <h6><span className='fw-bold'>AVG:</span>  {Math.round(chartReCall.avg *100)/100}</h6>
                </Col>
                <Col style={{height: '250px', maxWidth: '250px'}}>
                  <h5>F1 Score</h5>
                  <PolarArea
                    ref={chartF1Reference}
                    data={{
                      labels: chartF1.labels,
                      datasets: [
                          {
                            label: 'F1 Score',
                            data: chartF1.points,
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
                        max: 1
                      }
                    }}
                  />
                  <h6><span className='fw-bold'>AVG:</span>  {Math.round(chartF1.avg *100)/100}</h6>
                </Col>
              </Row>

              
              :null}

              {submitted && words.length  ? 
                <div style={{height: '300px'}}>

                  <ReactWordcloud options={options} size={size} callbacks={callbacks} words={words}/> 
                </div>
              : null }

                       
            </Col>
          
          : null}
          
        </Row>
      </Col>
    </Content>
    </>
    
    
    )
    
  }
  
  export default SimpleLayout
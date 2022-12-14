import React, { useEffect } from 'react'
import { useState } from 'react'
import {  Badge, Button, Col, FloatingLabel, Form, ListGroup, Modal, Row } from 'react-bootstrap'
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
import { getCoefficients, getPrediction, getProfile, getReport, goTrain } from '../services/apiService'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

ChartJS.overrides.polarArea.plugins.legend.display = false;

const SimpleLayout = (props) => {
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [comment, setComment] = useState('')
  const [wordsPositive, setWordsPositive] = useState([])
  const [wordsNegative, setWordsNegative] = useState([])

  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const [stars, setStars] = useState([])

  const [profile, setProfile] = useState(null)

  const [chartPrecision, setChartPrecision] = useState(null)
  const chartPrecisionReference = useRef()

  const [chartReCall, setChartReCall] = useState(null)
  const chartReCallReference = useRef()

  const [chartF1, setChartF1] = useState(null)
  const chartF1Reference = useRef()

  useEffect(()=>{
    handleClean()
  }, [alert, error])

  const callbacks = {
    getWordColor: word => word.value > 50 ? "green" : "red",
  }

  const callbacksNegative = {
    getWordColor: word => word.value > 50 ? "red" : "green",
  }

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
  };
  const size = [400, 300];

  

  const handleClean = async() =>{
    if(alert !== null )setAlert(null)
    if(error !== null )setError(null)
    setLoading(false)
    setSubmitted(false)
    setComment('')
    setStars([])
  }

  const handleClose = () =>{
    setShow(false)
  }

  const handleSummit = async() =>{
    setError(null)
    setLoading(true)

    if(!comment || comment === ''){
      setError('Not comment received')
      setLoading(false)
      return
    }

    const params = {
      registros:[
        {
          text: comment
        }
      ]
    }


    const response_predict = await getPrediction(params)
    let decode = JSON.parse(response_predict)
    if(decode && Array.isArray(decode)){
      handleStars(decode[0])
    }

    if(!chartPrecision?.points){
      const response_report = await getReport()
      processStatistics(response_report)
    }

    if(!wordsPositive?.length){
      const response_coefficients = await getCoefficients()
      processWords(response_coefficients)
    }

    if(!profile){
      const response_profile = await getProfile()
      setProfile(response_profile)
    }

  
    setSubmitted(true)
    
    
    setLoading(false)
    
  }

  const processWords = (_params) =>{
    const aux1 = []
    const aux2 = []
    let keys = Object.keys(_params)
    for(let i=0; i< keys.length; i++){
      let key = keys[i]
      const m1 = Math.abs(_params[key]['4']) >= 1 ? 1 : (Math.abs(_params[key]['4']) < 0.01 ? 0.1 : Math.abs(_params[key]['4']))
      const abs1 = m1 * 50 
      let value1 = 0
      if(_params[key]['4'] > 0){
        value1 = 50 + abs1
      } else {
        value1 = 50 - abs1
      }

      const obj1 = {
        text: key,
        value: value1
      }
      aux1.push(obj1)

      const m2 = Math.abs(_params[key]['0']) >= 1 ? 1 : (Math.abs(_params[key]['0']) < 0.01 ? 0.1 : Math.abs(_params[key]['0']))
      const abs2 = m2 * 50 
      let value2 = 0
      if(_params[key]['0'] > 0){
        value2 = 50 + abs2
      } else {
        value2 = 50 - abs2
      }

      const obj2 = {
        text: key,
        value: value2
      }
      aux2.push(obj2)
    }
    setWordsPositive(aux1)
    setWordsNegative(aux2)
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

    for(let i=0; i< keys.length; i++){
      let key = keys[i];
      if(stats['precision'][key]){
        const digit = key.match(/(\d+)/g)
        if(digit && digit[0]){
          const num = Number.parseInt(digit[0]) + 1
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
          const num = Number.parseInt(digit[0]) + 1
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
          const num = Number.parseInt(digit[0]) + 1
          auxF1.points.push(stats['f1-score'][key])
          auxF1.labels.push( num === 1 ? num + ' star': num + ' stars' )
        } else if(key === 'avg'){
          auxF1.avg = stats['f1-score'][key]
        }
      }
    }
    setChartPrecision(auxPrecision)
    setChartReCall(auxReCall)
    setChartF1(auxF1)
  }

  const handleUpload = async(e) => {
    try {
      setShow(false)
      setLoading(true)
      let _params = {}
      const fileReader = new FileReader()
      fileReader.readAsText(e.target.files[0], "UTF-8")
      fileReader.onload = e => {
        _params = JSON.parse(e.target.result)
        goTrain(_params)
      }


      await  new Promise(resolve => setTimeout(resolve, 10000)) 
      setLoading(false)
      setAlert('This process may take a while, go get yourself some coffee!')
      setWordsNegative([])
      setWordsNegative([])
      setChartPrecision(null)
      setProfile(null)
      handleClean()

    } catch (error) {
      console.log('error', error)
      setLoading(false)
      setError('Error while reading the file')
    }
    
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
      { error ? <Alert variant='error'>{error}</Alert>: null}
      { alert ? <Alert variant='success'>{alert}</Alert>: null}
    <Content>
      { loading ? <Loading /> : null}
      <Col className='p-relative'>
        <Row className='justify-content-center'>
          <Col sm={ submitted? 4 : 6} >
            <div className='content-card text-center mb-3 shadow-light'>
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
              {submitted ? 
              
              <Col className='text-center'>
                <br /><br />
                <span>Prediction:</span>
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
                <br />
              </Col>
              : null}

                
              
              <Col className='text-center'  >
              <br />
              { !submitted ? 
                
                  <Button disabled={submitted} onClick={()=> handleSummit()} variant='warning'>Submit</Button>
                
              : <Button  onClick={()=> handleClean()} variant='warning'>Try another</Button>}
              <br/><br/>
              </Col>

            
            </div>
            { submitted && profile ? 
              <div className='content-card text-center mb-3 shadow-light'>
                <h3>Profile of the Model</h3>
                <ListGroup>
                  { profile?.n_cells_missing?.toString() ? 
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      Cells missing
                    </div>
                    <Badge bg="warning" pill>
                      {profile.n_cells_missing}
                    </Badge>
                  </ListGroup.Item>
                  :null}
                  { profile?.n_duplicates ? 
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      Duplicates
                    </div>
                    <Badge bg="warning" pill>
                      {profile.n_duplicates}
                    </Badge>
                  </ListGroup.Item>
                  :null}
                  { profile?.count ? 
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      Count
                    </div>
                    <Badge bg="warning" pill>
                      {profile.count}
                    </Badge>
                  </ListGroup.Item>
                  :null}
                </ListGroup>
              </div>
            : null}
            
          
          </Col>
          { submitted ? 
            <Col className='text-center'>
              <div className='content-card shadow-light'>
              <h3>About the Model</h3>
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
              <br /><br /> <br /> 
              <Row className='justify-content-center'>
                <Col className='text-center' style={{height: '250px', maxWidth: '350px'}}>
                  <h4>Positive words</h4>
                  {submitted && wordsPositive.length  ? 
                
                    <div style={{height: '300px'}}>
                      <ReactWordcloud options={options} size={size} callbacks={callbacks} words={wordsPositive}/> 
                    </div>
                  : null }
                </Col>
                <Col sm={1}></Col>
                <Col className='text-center' style={{height: '250px', maxWidth: '350px'}}>
                  <h4>Negative words</h4>
                  {submitted && wordsNegative.length  ? 
                
                    <div style={{height: '300px'}}>
                      <ReactWordcloud options={options} size={size} callbacks={callbacksNegative} words={wordsPositive}/> 
                    </div>
                  : null }
                </Col>
              </Row>
              <br/><br/><br/><br/>
              
              </div>   
              <Button className='absolute' style={{bottom: '28px',right: '18px', position: 'absolute'}}  onClick={()=> setShow(true)} variant='info'>Update Model</Button>
            </Col>
          
          : null}
          
        </Row>
      </Col>
    </Content>
    <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Upload JSON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
              <Col>
                  <Form.Control type="file" id="image-file" label='Select a JSON file' onChange={(e) => handleUpload(e)} />
              </Col>
          </Row>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
      </Modal.Footer>
    </Modal>
    </>
    
    
    )
    
  }
  
  export default SimpleLayout
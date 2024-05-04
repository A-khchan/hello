import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import React from 'react';
import background from './img/IMG_7064.jpg'

function App() {

  const [drinks, setDrinks] = useState([])
  const [name, setName] = useState("Input a name")
  const [description, setDescription] = useState("Input a description")
  const [id, setId] = useState(-1)
  const [selectedId, setSelectedId] = useState(-1)
  const [loadingRecord, setLoadingRecord] = useState(false)
  // const django_server = "http://35.185.233.59:8000/"
  const django_server = "https://www.roboosoft.com/"
  const [errorMsg, setErrorMsg] = useState("")

  const ErrorTextRef = React.useRef(null)

  useEffect(() => {
    loadDrinks()
    resetError()
  }, [])

  function loadDrinks() {
    //GET
    fetch(django_server + "drinks/")
      .then((response) => {
         console.log("response is: ", response)
         return response.json()
      }    
      )
      //.then((data) => console.log(data))
      .then((data) => {
                          setDrinks(data)
                          
                      })       
      .catch(err => {
        setErrorMsg(err.message)
        console.log("loadDrinks: ", err.message)
        setTimeout(() => {
          ErrorTextRef.current.classList.add('invisible')
        }, 1000);
      }) 

  }

  function newData() {
    setLoadingRecord(false)
    setId(-1)
    setSelectedId(-1)
    setName("")
    setDescription("")
    setLoadingRecord(false)
  }

  function addData() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'name': name, 'description': description })
    }
    fetch(django_server + "drinks/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
                          setId(data.id)
                          setSelectedId(data.id)
                          loadDrinks()
                      })
    //.then((data) => console.log(data))
  }

  function updateData() {
    resetError()

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'name': name, 'description': description })
    }
    fetch(django_server + "drinks/" + id, requestOptions)
      .then((response) => 
                          {
                              if (response.status >= 400) {
                                //console.log("status >= 400")
                                throw new Error("Error updating record")
                              }
                              //If enclosed in { } with other lines of codes, 
                              //return is required to make
                              //the next line 'data' to be a valid object.
                              return response.json()
                          }
                          )
      .then((data) => {
                          console.log("data is " + data)
                          setId(data.id)
                          loadDrinks()
                      })
      .catch(err => {
        setErrorMsg(err.message)
        setTimeout(() => {
          ErrorTextRef.current.classList.add('invisible')
        }, 1000);
      })
  }

  function resetError() {
    setErrorMsg(" ")
    ErrorTextRef.current.classList.remove('invisible')
  }

  function deleteData(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'name': name, 'description': description })
    }
    fetch(django_server + "drinks/" + id, requestOptions)
      .then((response) => { loadDrinks()
                            newData() 
                          })
  }

  function setInputFields(id, name, description) {
    setLoadingRecord(true)
    setSelectedId(id)
    setId(id)
    setName(name)
    setDescription(description)
    setLoadingRecord(false)
    resetError()
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <div><h3>This is a demo of consuming REST API by React.</h3></div>

      <div className='Record'>
        <div>
            <div className='wrapper'>
              <div className='Record'>
                <div className='HeaderName'>Name</div>
                <div className='HeaderDescription'>Description</div>
              </div>
              <div style={ { maxHeight: '50vh', overflowY: 'scroll'} }>
              {
                drinks.map(
                  item => <div 
                    key={item.id}>
                    <div className='Record' >
                      
                      <div className='Record'
                      onClick={() => setInputFields(item.id, item.name, item.description)}
                      style={item.id == selectedId ? { backgroundColor: '#80a080' } : null}>
                      <div className='Name'>{item.name}</div>
                        <div className='Description'>{item.description}</div>
                      </div>

                      <div className='deleteRecord' onClick={() => deleteData(item.id)}>x</div>
                    </div>
                  </div>
                )
              }
              </div>
            </div>
            <button className='LoadAllButton' onClick={loadDrinks}>Refresh</button>
        </div>

        <div>
          <div className='inputWrapper'>
            <div className='InputRow'>
              <div className='InputLabel'>Id</div>
              <div className='InputLabel'>{ id == -1 ? "To be assigned" : id}</div>
            </div>
            <div className='InputRow'>
              <div className='InputLabel'>Name</div>
              <input className='inputField' type="text" value={name} onChange={e => {
                if (loadingRecord == false)
                  setName(e.target.value)
              }} />
            </div>
            <div className='InputRow'>
              <div className='InputLabel'>Description</div>
              <input className='inputField' type="text" value={description} onChange={e => {
                if (loadingRecord == false)
                  setDescription(e.target.value)
              }} />
            </div>
            <button className='actionButton' onClick={newData}>New</button>
            <button className='actionButton' 
                    disabled={name.length==0 || description.length==0} 
                    onClick={addData}>Add</button>
            <button className='actionButton' disabled={id==-1} onClick={updateData}>Update</button>

            <div ref={ErrorTextRef} className='ErrorText'>
              { errorMsg }
            </div>
          </div>
          <div className='instruction'>To update a record, click on a record on the left, then update in the above table.</div>
        </div>
      </div>

    </div>
  );
}

export default App;

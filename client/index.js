
const getDomoCreds = () =>{
    axios.get('http://localhost:8080/authorize')
    .then( res =>{
        console.log(res.data)
        alert(`Successfully authorized to the Domo API. Bearer token: ${res.data}`)})
    .catch(err => console.log(err.data))
}

const renderData = data =>{
    let x = document.createElement('h1')
    x.textContent = data
    document.body.appendChild(x)
}

const submitButton = document.getElementById('query-data')
const datasetId = document.getElementById('dataset-id')
const query = document.getElementById('query-id')


const queryData = (e) => {
    e.preventDefault()
    // console.log(datasetId.value,query.value)
    const obj = {
        datasetId: datasetId.value,
        query: query.value
    }
    axios.post('http://localhost:8080/querydata',obj)
    .then(res => renderData(res.data))
    .catch(err => console.log(err.data))
    
}


submitButton.addEventListener("click", queryData)
getDomoCreds()
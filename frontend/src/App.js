import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {format} from 'date-fns'
import styles from './App.module.css'

axios.defaults.baseURL = 'https://admindev.inceptia.ai';

const App = () => {
    
    const [user, setUser] = useState({})
    const [clients, setClients] = useState([])
    const [cases, setCases] = useState({})    
    const [today] = useState( format(new Date(), 'yyyy-MM-dd') )
    const [start, setStart] = useState('')
    const [end, setEnd] = useState(today)
    const [activeFilter, setFilter] = useState('todos')

    const login = async () => {
        try {
            const user = await axios.post('/api/v1/login/', {"email": "reactdev@iniceptia.ai",
            "password": "4eSBbHqiCTPdBCTj"})
            localStorage.setItem("user", JSON.stringify(user.data));
            setUser(user.data)
        } catch (error) { console.log(error)}
    }    

    const authHeader = () => {        
        if (user && user.token) {     
          return { 'authorization': 'JWT '+ user.token };
        } 
    }

    const getData = async () => {
        try {
            const response = await axios.get('/api/v1/clients/', {headers: authHeader()})
            setClients([...response.data, ...response.data[0].users.map(u => ({...u, name:u.first_name}))])

         } catch (error) {console.log(error)}
    }

    const getCases = async (id) => {   
        const url = `/api/v1/inbound-case/?client=${id}&local_updated__date__gte:${start}&local_updated__date__lte=${end}`
        
        try {
            const response = await axios.get(url, {headers: authHeader()})
            setCases(response.data)

        } catch (err) {console.log(err)}
    }

    const handleFilter = (filterName) => {        
        setFilter(filterName)        
    }

    useEffect(()=>{
        login()
    },[])
    
    useEffect(()=>{
        if(user && user.token){
            getData()
        }        
    },[user])
    

    const filterNames = [
        'todos',
        'transferido',
        'niega confirmación datos',
        'cliente no encontrado en db', 
        'llamando',
        'cortó cliente',
        'mail enviado',
        'indefinido',
        'no encontrado en db'
    ]

    return (
        <div className={styles.container}>
            <section className={styles.clientList}>
                <div className={styles.title}>CLIENTE</div>
                {
                    clients && clients.length ? clients.map( client => 
                    <div 
                        className={styles.client}
                        onClick={()=>{getCases(client.id)}}
                        key={client.id}>
                            {client.name}
                    </div>) : <div>Loading...</div>
                }            
            </section>

            <section className={styles.results}>
            <div className={styles.dateFilters}>
                <label htmlFor='start'>Desde</label>
                <input 
                    type='date' 
                    name='start'
                    min='2021-01-01' 
                    value='2020-12-31'
                    max={today} 
                    onChange={(e)=>setStart(e.target.value)}/>
                <br/>
                <label htmlFor='end'>Hasta</label>
                <input 
                    type='date' 
                    name='end'
                    min='2021-01-01' 
                    max={today} 
                    value={end} 
                    onChange={(e)=>setEnd(e.target.value)} />
            </div>
           
            <div>
                {
                 cases && cases.results && cases.results.length && (
                    <>
                     <div className={styles.filters}>
                         {
                            filterNames.map( (filter, i) => 
                            <div 
                            key={i}
                            className={ (filter===activeFilter) ? styles.filterActive : styles.filter}
                            id={filter}
                            onClick={()=>{handleFilter(filter)}}
                            >{filter.toUpperCase()}
                            </div>)
                
                         }
                    </div>
                    <table cellSpacing='0' className={styles.caseTable}>
                        <thead>

                            <tr>
                                <th>Gestonado</th>
                                <th>ID caso</th>
                                <th>Teléfono</th>
                                <th>DNI</th>
                                <th>Grupo</th>
                                <th>Orden</th>
                                <th>Llamada</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                            cases && cases.results && cases.results.length &&
                            cases.results.map( (result, index) => ( 
                            <tr key={index}>
                                <td className={styles.red}><span>📆 </span>{result.last_updated}</td>
                                <td className={styles.blue}>{result.case_uuid}</td>
                                <td className={styles.blue}>{result.phone}</td>
                                <td className={styles.red}>{result.extra_metadata.dni}</td>
                                <td className={styles.red}>{result.extra_metadata.grupo}</td>
                                <td className={styles.red}>{result.extra_metadata.orden}</td>
                                <td className={styles.red}>
                                    <a href={result.recording}><span>💬</span> {result.case_duration}</a> 
                                    </td>
                                <td className={styles.status}><span> {result.case_result.name.toUpperCase()}</span></td>
                            </tr>)
                            )
                            }
                        </tbody>                   
                </table>                    
                </>)
                }                
            </div>
            </section>
        </div>
    );
}

export default App;

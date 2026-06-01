import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/captainContext';

const CaptainProtectWrapper = ({children}) => {
	const token = localStorage.getItem('token')
	const navigate = useNavigate();
	const {captain, setcaptain} = useContext(CaptainDataContext);
	const [isLoading, setisLoading] = useState(true)


	useEffect(()=>{
		if(!token){
			navigate('/captain-login');
			return;
		}

		axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
			headers:{
				Authorization:`Bearer ${token}`
			}
		}).then(response => {
			if(response.status === 200){
				const data = response.data;
				setcaptain(data.captain)
				setisLoading(false)
			}
		}).catch(err => {
			console.log(err)
			localStorage.removeItem('token')
			navigate('/captain-login')
		})

	}, [token])

	if(isLoading){
		return (
			<div>Loading...</div>
		)
	}

  return (
        <>
			{children}
		</>
  )
}

export default CaptainProtectWrapper
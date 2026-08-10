import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';


const UserProtectWrapper = ({children}) => {
	const token = localStorage.getItem('userToken') || localStorage.getItem('token')
	const navigate = useNavigate();
	const {user, setuser} = useContext(UserDataContext);
	const [isLoading, setisLoading] = useState(true)
	
	useEffect(()=>{
		if(!token){
			navigate('/login');
			return;
		}

		axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
			headers:{
				Authorization:`Bearer ${token}`
			}
		}).then(response => {
			if(response.status === 200){
				const data = response.data;
				setuser(data.user)
				setisLoading(false)
			}
		}).catch(err => {
			console.log(err)
			localStorage.removeItem('userToken')
			navigate('/login')
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

export default UserProtectWrapper

import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                console.log(err.response?.data);
            }
        };

        logout();
    }, []);

    return (
        <div>UserLogout</div>
    );
};

export default UserLogout;


// import React, { useEffect } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';


// const UserLogout = () => {
// 	const token = localStorage.getItem('token');
// 	const navigate = useNavigate();

// 	axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`
// 		}
// 	}).then((response) => {
// 		if(response.status === 200){
// 			localStorage.removeItem('token');
// 			navigate('/login')
// 		}
// 	}).catch((err) => {
// 		console.log(err.response?.data);
// 	});

//   return (
//     <div>UserLogout</div>
//   )
// }

// export default UserLogout
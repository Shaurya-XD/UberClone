import React, { createContext, useState } from 'react'

export const UserDataContext = createContext();

const UserContext = (props) => {
  const [user, setuser] = useState({
    email:'',
    fullName:{
      firstName:'',
      lastName:''
    }
  })

  return (
    <div>
      <UserDataContext.Provider value={[user, setuser]}>
        {props.children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
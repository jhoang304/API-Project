// frontend/src/components/Navigation/index.js
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// function Navigation({ isLoaded }){
//   const sessionUser = useSelector(state => state.session.user);

//   return (
//     <ul>
//       <li>
//         <NavLink exact to="/">Home</NavLink>
//       </li>
//       {isLoaded && (
//         <li>
//           <ProfileButton user={sessionUser} />
//         </li>
//       )}
//     </ul>
//   );
// }

// export default Navigation;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
// import NewSpot from '../NewSpot';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="NavBar">

      <NavLink exact to="/" className="Home-Icon">
      <img id="logo" src="https://cdn.discordapp.com/attachments/320286625521336341/1127852221082652724/logo2.png" alt="logo"/>
      </NavLink>

      {isLoaded && (
        <div className="userOptions">
        {sessionUser && <NavLink to="/spots/new" id="NewSpot">Create a New Spot</NavLink>}
        <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;

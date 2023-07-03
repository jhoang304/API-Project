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
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="NavBar">

      <NavLink exact to="/" className="Home-Icon">
      {/* <i className="fa fa-dragon"></i> */}
      <i class="fa-duotone fa-glass"></i>
      bobabnb
      </NavLink>

      {isLoaded && (
        <div className="userOptions">
        {sessionUser && <Link to="/spots/new" id="CreateNewSpot">Create a New Spot</Link>}
        <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;

import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ProfileSidebar from '../../components/ProfilePageComponents/ProfileSideBar/ProfileSideBar'
import ProfileDetails from '../../components/ProfilePageComponents/ProfileDetailsComponent/ProfileDetails'

const ProfilePage = () => {
  return (
    <div>
      <Navbar/>
<main>
  <div style={{ display: 'flex', gap: '2rem' }}>
    <ProfileSidebar />
    <div style={{ flex: 1 }}>
      <ProfileDetails/>
    </div>
  </div>
</main>

      <Footer/>
    </div>
  )
}

export default ProfilePage

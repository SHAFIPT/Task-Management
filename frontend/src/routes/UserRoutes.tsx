import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHomePage from '../pages/Home/UserHome'
import PrivateRoute from './PrivateRoute'
import TaskListPage from '../pages/Tasks/TaskListPage'
import ProjectListPage from '../pages/Projects/ProjectListPage'

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<PrivateRoute redirectTo="/auth/login" />}>
          <Route path='/' element={<UserHomePage/>}/>
          <Route path='/Task-list' element={<TaskListPage/>}/>
          <Route path='/Project-list' element={<ProjectListPage/>}/>
        </Route>
    </Routes>
  )
}

export default UserRoutes

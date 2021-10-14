import React from 'react'
import { Slot } from 'react-page-layout';
import Header from './Header';
import dashboard from '../../assets/images/dashboard_white.png';
import list from '../../assets/images/list_alt.png';
import profile from '../../assets/images/account_circle.png';
import { Link } from 'react-router-dom';
import Breadcrumbs from './SecondNavBar';

export default function DefaultLayout() {
    return (
        <div className="main-wrapper">
            <Header />
            <div className="content-wrapper">
                <aside className="sidebar">
                    <ul>
                        <Link to="/"><li>
                            <img width="40" height="40" src={dashboard} />
                            <span>Dashboard</span>
                        </li></Link>
                        <Link to="/transaction"><li>
                            <img width="40" height="40" src={list} />
                            <span>Transaction List</span>
                        </li></Link>
                        <Link to="/profile"><li>
                            <img width="40" height="40" src={profile} />
                            <span>My Profile</span>
                        </li></Link>
                    </ul>
                </aside>
                <div className="content">
                    <Slot name="breadcrumbs" className="second-nav-bar" />
                    <Slot name="main" component="section" />
                </div>
            </div>
        </div>
    )
}

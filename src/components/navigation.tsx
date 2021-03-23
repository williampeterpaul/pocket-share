import { signin, signout, useSession } from 'next-auth/client'
import Link from 'next/link'

const Navigation = () => {
    const [session, loading] = useSession()

    return (
        <div className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
            <Link href='/'>
                <a className="navbar-brand"><img alt="Pipeline" src="/logo.svg" /></a>
            </Link>
            <div className="collapse navbar-collapse flex-column" id="navbar-collapse">
                <ul className="navbar-nav d-lg-block">
                    <li className="nav-item">
                        <Link href='/'>
                            <a className="nav-link">Latest</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href='/trending/week'>
                            <a className="nav-link">Trending</a>
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="d-none d-lg-block w-100">
                    <span className="text-small text-muted">Quick Links</span>
                    <ul className="nav nav-small flex-column mt-2">
                        <li className="nav-item">
                            <Link href='/'>
                                <a className="nav-link">Home</a>
                            </Link>
                        </li>

                        {session && <>
                            <li className="nav-item">
                                <Link href={'/profile/' + session.user.id}>
                                    <a className="nav-link">My Profile</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href='/account'>
                                    <a className="nav-link">My Account</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href='/'>
                                    <a className="nav-link" onClick={signout}>Logout</a>
                                </Link>
                            </li>
                        </>}
                        {!session && <>
                            <li className="nav-item">
                                <Link href='/'>
                                    <a className="nav-link" onClick={signin}>Login</a>
                                </Link>
                            </li>
                        </>}
                    </ul>
                    <hr />
                </div>
                <div>
                    <form>
                        <div className="input-group input-group-dark input-group-round">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="material-icons">search</i></span>
                            </div><input aria-label="Search app" className="form-control form-control-dark"
                                placeholder="Search" type="search" />
                        </div>
                    </form>
                    <div className="mt-2">
                        <Link href='/upload'>
                            <button className="btn btn-primary btn-block" id="newContentButton" type="button">Share Your Pocket</button>
                        </Link>
                    </div>
                </div>
            </div>
            {session &&
                <div className="d-none d-lg-block">
                    <div className="dropup">
                        <a href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img alt="Image" src={session.user.image} className="avatar" />
                        </a>
                        <div className="dropdown-menu">
                            <a href="nav-side-user.html" className="dropdown-item">Profile</a>
                            <a href="utility-account-settings.html" className="dropdown-item">Account Settings</a>
                            <a href="#" className="dropdown-item">Log Out</a>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Navigation

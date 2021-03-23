import Header from '../components/header'
import Footer from '../components/footer'
import Navigation from './navigation'
import Head from 'next/head'

export default function Layout({ children }) {
    return (
        <div className="layout layout-nav-side">
            <Head>
                <title>My page title</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css?family=Gothic+A1" rel="stylesheet" />
            </Head>
            <Navigation />
            <div className="main-container">
                <Header />
                {children}
            </div>
            <Footer />
        </div>
    )
}
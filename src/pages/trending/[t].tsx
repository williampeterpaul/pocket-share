import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout';

const preload = async (url: RequestInfo) => {
    try {
        const options: RequestInit = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }

        const response = await fetch(url, options);
        const json = await response.json()

        return json;
    } catch (error) {
        return {
            data: undefined,
            error: 'Invalid server response'
        }
    }
}


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export async function getStaticProps({ params }) {
    const { data, error } = await preload(`${process.env.NEXTAUTH_URL}/api/pocket/trending?t=${params.t}`)

    if (error) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data, current: params.t },
        revalidate: 2,
    }
}

const Popular: React.FunctionComponent = (props) => (
    <Layout>
        <Head>
            <title>My page title!</title>
        </Head>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-9">
                    <div className="page-header mb-4">
                        <div className="media">
                            <img alt="Image" className="avatar avatar-lg mt-1" src="/logo.svg" />
                            <div className="media-body ml-3">
                                <h1 className="mb-0">Trending Pockets</h1>
                                <p className="lead">All Categories</p>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs nav-fill" role="tablist">
                        <li className="nav-item">
                            <Link href="/trending/week">
                                <a className={`nav-link ${props['current'] === 'week' ? 'active' : 'inactive'}`}>Weekly</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/trending/month">
                                <a className={`nav-link ${props['current'] === 'month' ? 'active' : 'inactive'}`}>Monthly</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/trending/all">
                                <a className={`nav-link ${props['current'] === 'all' ? 'active' : 'inactive'}`}>All Time</a>
                            </Link>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade active show" id="activity" role="tabpanel">
                            <div className="content-list">
                                <div className="row content-list-head">
                                    <div className="col-auto">
                                        <h3>Activity</h3>
                                    </div>
                                    <form className="col-md-auto">
                                        <div className="input-group input-group-round">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="material-icons">filter_list</i>
                                                </span>
                                            </div>
                                            <input type="search" className="form-control" placeholder="Filter activity" aria-label="Filter activity" />
                                        </div>
                                    </form>
                                </div>
                                <div className="content-list-body">
                                    <ol className="list-group list-group-activity">
                                        {props['data'] && props['data'].map(pocket =>
                                            <li className="list-group-item" key={pocket.id}>
                                                <div className="media align-items-center">
                                                    <ul className="avatars">
                                                        <li>
                                                            <div className="avatar bg-primary">
                                                                <i className="material-icons">edit</i>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div className="media-body">
                                                        <div>
                                                            <span className="h6">{pocket.name}</span>
                                                        </div>
                                                        <span className="text-small" >{pocket.brand}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
)

export default Popular

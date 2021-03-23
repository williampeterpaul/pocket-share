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
    const { data, error } = await preload(`${process.env.NEXTAUTH_URL}/api/product/${params.id}`)

    if (error) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
        revalidate: 2,
    }
}

const Product = (props) => (
    <Layout>
        <Head>
            <title>My page title!</title>
        </Head>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-9">
                    <div className="page-header mb-4">
                        <div className="media">
                            <img alt="Image" className="avatar avatar-lg mt-1" src={props.data.image} />
                            <div className="media-body ml-3">
                                <h1 className="mb-0">{props.data.name}</h1>
                                <p className="lead">{props.data.brand}</p>
                            </div>
                        </div>
                    </div>
                    <div className="content-list-body">
                        <ol className="list-group list-group-activity">
                            <Link href='https://google.com'>
                                <a className="list-group-item list-group-item-action">
                                    <div className="media align-items-center">
                                        <ul className="avatars">
                                            <li>
                                                <div className="avatar bg-primary">
                                                    <i className="material-icons">link</i>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="media-body">    
                                            <div>
                                                <span className="h6" >Amazon</span>
                                            </div>
                                            <span className="text-small" >Purchase</span>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </ol>
                        <div className="col-auto mt-5">
                            <h3>14 Pockets using product</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
)

export default Product

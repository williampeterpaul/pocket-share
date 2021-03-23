import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'
import Layout from '../components/layout';
import Annotation from 'react-image-annotation'
import Content from '../components/annotation'
import { PointSelector } from 'react-image-annotation/lib/selectors'
import { useSession, signIn } from 'next-auth/client'
import { useSubmit } from '../hooks/submit'

const initial = {
    annotation: {},
    annotations: [],
    activeAnnotations: []
}

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

const Index = ({ updateAlert }) => {
    const [options, setOptions] = useState(initial);
    const [results, setResults] = useState(undefined);
    const [active, setActive] = useState(undefined);
    const [search, setSearch] = useState('');
    const [session, loading] = useSession();
    const searchInput = useRef(null);

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, [active])


    // actively rebuild body every render
    const body = {
        "pocket": {
            "image": '/download.jpg',
            "placements": options.annotations.map((annotation) => ({
                "x": annotation.geometry.x,
                "y": annotation.geometry.y,
                "product": {
                    id: annotation.data.productId,
                    name: annotation.data.name,
                    brand: annotation.data.brand
                }
            }))
        }
    }

    const { bind: publish } = useSubmit('POST', '/api/pocket', body, async (response: Response) => {
        updateAlert(response.status, response.statusText);

        if (response.status === 200) {
            const { data } = await response.json();

            Router.push('/pocket/' + data.id);
        }
    });

    if (loading) {
        return null
    }

    if (!session) {
        signIn();
        return null;
    }

    const onChange = (annotation: any) => {
        if (annotation.selection) {
            setActive(annotation);
        }
        else {
            setActive(undefined);
            setResults(undefined);
            setSearch('');
        }

        const changes = {
            ...options,
            annotation
        }

        setOptions(changes);
    }

    const onSubmit = (annotation: any) => {
        const { geometry, data } = annotation
        const changes = {
            ...options,
            annotation: {},
            annotations: options.annotations.concat({
                geometry,
                data: {
                    ...data,
                    id: Math.random()
                }
            })
        };

        setOptions(changes)
        setActive(undefined);
        setResults(undefined);
        setSearch('');
    }

    const onMouseOver = (id: string) => () => {
        const changes = {
            ...options,
            activeAnnotations: [
                ...options.activeAnnotations,
                id
            ]
        };

        setOptions(changes)
    }

    const onMouseOut = (id: string) => () => {
        const index = options.activeAnnotations.indexOf(id)
        const changes = {
            ...options,
            activeAnnotations: [
                ...options.activeAnnotations.slice(0, index),
                ...options.activeAnnotations.slice(index + 1)
            ]
        }

        setOptions(changes);
    }

    const onKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            if (results && results.length > 0) {
                const changes = {
                    ...active,
                    data: {
                        ...results[0]
                    }
                }

                onSubmit(changes);
                setActive(undefined);
                setResults(undefined);
                setSearch('');
            }
            else {
                events.onClick.none();
            }
        }
    }

    const events = {
        "onClick": {
            "all": () => {
                const changes = {
                    ...options,
                    annotation: {}
                }

                setOptions(changes);
                setActive(undefined);
                setResults(undefined);
                setSearch('');
            },
            "none": () => {
                if (search.length < 2) {
                    return;
                }
                const changes = {
                    ...active,
                    data: {
                        name: search,
                        brand: 'Manually added'
                    }
                }

                onSubmit(changes);
                setActive(undefined);
                setResults(undefined);
                setSearch('');
            },
            "result": (result: object) => () => {
                const changes = {
                    ...active,
                    data: {
                        ...result
                    }
                }

                onSubmit(changes);
                setActive(undefined);
                setResults(undefined);
                setSearch('');
            },
            "clear": (id: string) => () => {
                const index = options.annotations.findIndex((item) => item.data.id === id);
                const changes = {
                    ...options,
                    annotations: [
                        ...options.annotations.slice(0, index),
                        ...options.annotations.slice(index + 1)
                    ]
                }

                setOptions(changes)
                setActive(undefined);
                setResults(undefined);
                setSearch('');
            }
        },
        "onChange": {
            "search": async (event: any) => {
                setSearch(event.target.value)

                if (event.target.value.length < 2) {
                    setResults(undefined);
                    return;
                }

                const {
                    data: [response, count],
                    error
                } = await preload('/api/search/product/' + event.target.value);

                if (error) {
                    setResults(undefined);
                    return;
                }

                const mapped = response.map((result: any) => ({ ...result, productId: result.id }))

                setResults(mapped);
            }
        }
    }

    return (
        <Layout>
            <Head>
                <title>My page title!</title>
            </Head>
            <div className="content-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-11 col-xl-10">
                            <div className="page-header mb-4">
                                <h1 className="mb-0">Share Your Pocket</h1>
                                <p className="lead">Start by uploading a picture of your pocket </p>
                            </div>
                            <Annotation
                                src={'/download.jpg'}

                                value={options.annotation}
                                annotations={options.annotations}
                                type={PointSelector.TYPE}

                                onChange={onChange}
                                onSubmit={onSubmit}

                                renderContent={(props: any) => <Content key={props.annotation.data.id} {...props} />}

                                activeAnnotationComparator={(a: any, b: string) => a.data.id === b}
                                activeAnnotations={options.activeAnnotations}

                                allowTouch
                                disableOverlay
                                disableEditor
                            />
                        </div>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="sidebar-content">
                        <div className="chat-team-sidebar text-small">
                            <div className="chat-team-sidebar-top">
                                <div className="media align-items-center">
                                    <div className="media-body">
                                        <h5 className="mb-1">Tag Your Collection</h5>
                                        <p>Specify only the item make and model</p>
                                    </div>
                                </div>
                                {active &&
                                    <ul className="nav nav-tabs nav-justified" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={events.onClick.all}>All</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link active">Add item</a>
                                        </li>
                                    </ul>
                                }
                                {!active &&
                                    <ul className="nav nav-tabs nav-justified" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active">All</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link disabled">Add item</a>
                                        </li>
                                    </ul>
                                }
                            </div>
                            {active ?
                                <div className="chat-team-sidebar-bottom">
                                    <div className="px-3 mb-3">
                                        <div className="input-group input-group-round">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i className="material-icons">search</i></span>
                                            </div>
                                            <input onChange={events.onChange.search} minLength={2} maxLength={20} onKeyPress={onKeyPress} value={search} className="form-control" ref={searchInput} placeholder="Search Item Make and Model" type="search" />
                                        </div>
                                    </div>
                                    <div className="list-group list-group-flush">

                                        {results && results.map((result, index) => (
                                            <a className="list-group-item list-group-item-action" href="#" key={index}>
                                                <div className="media media-member mb-0">
                                                    <div className="media-body" id="1" onClick={events.onClick.result(result)}>
                                                        <h6 className="mb-0">{result.name}</h6>
                                                        <span>{result.brand}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}

                                        {search && search.length > 2 && <a className="list-group-item" href="#">
                                            <div className="media media-member mb-0">
                                                <div className="media-body" onClick={events.onClick.none}>
                                                    <h6 className="mb-0">None of the above</h6>
                                                    <span>Enter manually</span>
                                                </div>
                                            </div>
                                        </a>
                                        }
                                    </div>
                                </div>
                                : <div className="chat-team-sidebar-bottom mb-4">
                                    <div className="list-group list-group-flush">

                                        {options.annotations && options.annotations.map(annotation => (
                                            <a className="list-group-item list-group-item-action"
                                                key={annotation.data.id}
                                                onMouseOut={onMouseOut(annotation.data.id)}
                                                onMouseOver={onMouseOver(annotation.data.id)}
                                                href="#">
                                                <div className="media media-member mb-0">
                                                    <div className="media-body">
                                                        <h6 className="mb-0">{annotation.data.name}</h6>
                                                        <span>{annotation.data.brand}</span>
                                                    </div>
                                                    <button onClick={events.onClick.clear(annotation.data.id)} className="btn-options" type="button">
                                                        <i className="material-icons">clear</i>
                                                    </button>
                                                </div>
                                            </a>
                                        ))}

                                        <a className="list-group-item disabled" href="#">
                                            <div className="media media-member mb-0">
                                                <div className="media-body">
                                                    <h6 className="mb-0">Add another item</h6>
                                                    <span>Click the image to annotate</span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            }
                            <form  {...publish} className="chat-team-sidebar-footer mt-auto modal-footer">
                                <button className={`btn btn-primary btn-block`}
                                    disabled={options.annotations.length < 1 ? true : false}
                                    id="publish" type="submit">
                                    Publish</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Index

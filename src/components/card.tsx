import React, { useState, useRef, useEffect } from 'react';
import Timestamp from './timestamp';
import Content from './annotation'
import Annotation from 'react-image-annotation'
import { PointSelector } from 'react-image-annotation/lib/selectors'
import Link from 'next/link';

const Card = (props) => {
    const [options, setOptions] = useState({
        annotations: props.placements.map((placement: any) => ({
            "geometry": {
                "x": placement.x,
                "y": placement.y,
                "width": 0,
                "height": 0,
                "type": "POINT"
            },
            "data": {
                "productId": placement.product.public ? placement.product.id : undefined,
                "id": placement.product.id,
                "name": placement.product.name,
                "brand": placement.product.brand,
                "public": placement.product.public,
                "image": placement.product.image
            }
        })),
        activeAnnotations: []
    });

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

    const onClickUpvote = async () => {
        await fetch('/api/pocket/like/' + props.id);
    }

    return (
        <div className="card card-team">
            <div className="card-body">
                <div className="dropdown card-options">
                    <button aria-expanded="false" aria-haspopup="true" className="btn-options" data-toggle="dropdown" type="button">
                        <i className="material-icons">more_vert</i></button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item" href="#">Manage</a>
                        <div className="dropdown-divider"></div><a className="dropdown-item text-danger" href="#">Leave Team</a>
                    </div>
                </div>
                <div className="card-title">
                    <a className="media media-member" href="#">
                        <img alt={props.user.name} src={props.user.image} className="avatar avatar-md" />
                        <div className="media-body">
                            <h6 className="mb-0">{props.user.name}</h6>
                            <span className="text-body">{props.user.profession}</span>
                        </div>
                    </a>
                </div>
                <Annotation
                    src={props.image}

                    annotations={options.annotations}
                    type={PointSelector.TYPE}

                    onClick={() => null}
                    onUpdate={() => null}

                    renderContent={(props: any) => <Content key={props.annotation.data.id} {...props} />}

                    activeAnnotationComparator={(a: any, b: string) => a.data.id === b}
                    activeAnnotations={options.activeAnnotations}

                    allowTouch
                    disableOverlay
                    disableEditor
                />
                <div className="content-list-body mt-3">
                    <ol className="list-group list-group-activity small">
                        {options.annotations && options.annotations.map(annotation =>
                            <a className="list-group-item list-group-item-action"
                                key={annotation.data.id}
                                onMouseOut={onMouseOut(annotation.data.id)}
                                onMouseOver={onMouseOver(annotation.data.id)}>

                                <div className="media align-items-center">
                                    <ul className="avatars">
                                        <li>
                                            <img alt="Peggy" src={annotation.data.image} className="avatar filter-by-alt" data-filter-by="alt" />
                                        </li>
                                    </ul>
                                    <div className="media-body">
                                        <div>
                                            <span className="h6">{annotation.data.name}</span>
                                        </div>
                                        <span className="text-small">{annotation.data.brand}</span>
                                        {annotation.data.public && <span><Link href={`/product/${annotation.data.id}`}>View product</Link></span>}
                                    </div>
                                </div>
                            </a>
                        )}
                    </ol>
                </div>
                <div className="card-meta d-flex justify-content-between mt-3">
                    <a onClick={onClickUpvote} className="d-flex align-items-center" role='button'>
                        <i className="material-icons mr-1">thumb_up_alt</i>
                        <span className="text-small">{props.likeCount}</span>
                    </a>
                    <Timestamp time={props.createdAt} />
                </div>
            </div>
        </div>
    )
}

export default Card
import React from "react";

const Card = ({ name, location, sport, imageLink, courtType  }) => {
    return (
        <div className="card">
            <img
                src={imageLink}
                alt=""
                className="w-full h-32 sm:h-48 object-cover rounded"
            />
            <div className="m-4">
                <span className="font-bold text-lg">{name}</span>
                <span className="block text-gray-500 text-sm">City: {location}</span>
                <span className="block text-gray-500 text-sm capitalize">Type: {courtType}</span>
            </div>
            <div className="badge bg-blue-500 text-white p-2 rounded">
                <span>{sport}</span>
            </div>
        </div>
    );
}

export default Card;

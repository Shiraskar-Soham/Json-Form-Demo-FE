import React from 'react';
import DynamicListing from "../dynamicCard/App"

export default function AccessRequestPending() {
    return <DynamicListing listingStatus="PENDING" />;
}
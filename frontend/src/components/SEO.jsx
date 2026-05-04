import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = "Winze Technologies | Enterprise Communication, Security & AI",
    description = "Winze Technologies delivers unified communications, AI security, SaaS products, and IT infrastructure with 16+ years of enterprise expertise.",
    keywords = "unified communications, AI security, SaaS products, IT infrastructure, enterprise software",
    url = "https://www.winzetech.com",
    image = "/og-image.jpg",
    type = "website"
}) => {
    const siteUrl = url;
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={siteUrl} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content="Winze Technologies" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Helmet>
    );
};

export default SEO;